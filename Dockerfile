# ===== Stage 1: Build Frontend =====
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ===== Stage 2: Build Backend =====
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src/ src/

# Copy frontend build output into Spring Boot static resources
COPY --from=frontend-build /app/frontend/dist/ src/main/resources/static/

RUN ./mvnw clean package -DskipTests -B

# ===== Stage 3: Production =====
FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app

RUN addgroup --system app && adduser --system --ingroup app app

COPY --from=backend-build /app/target/*.jar app.jar

RUN chown -R app:app /app
USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Xmx512m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
