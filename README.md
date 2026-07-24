# Employee Management System

A production-ready, full-stack Employee Management System built with **Spring Boot 3** + **React** featuring JWT authentication, role-based access control, and a modern admin dashboard.

## 🚀 Tech Stack

### Backend
- **Java 21** + **Spring Boot 3.5.3**
- **Spring Security 6** with JWT Authentication
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL** (Neon for cloud)
- **Maven** (with wrapper)

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Recharts** (Charts & Analytics)
- **Axios** (API client with JWT interceptors)
- **React Router v7**

### DevOps
- **Docker** (multi-stage build)
- **Render** (deployment)
- **GitHub Actions** (CI/CD)

## ✨ Features

### Authentication & Security
- ✅ JWT Token Authentication
- ✅ BCrypt Password Hashing
- ✅ Refresh Token Support with Logout
- ✅ Role-Based Access Control (ADMIN / EMPLOYEE)

### Employee Management
- ✅ Full CRUD Operations
- ✅ Search by keyword
- ✅ Filter by Department
- ✅ Filter by Salary Range
- ✅ Pagination & Sorting
- ✅ CSV Export

### Dashboard
- ✅ Stat Cards (Total Employees, Departments, Avg Salary)
- ✅ Employees by Department Chart (Pie)
- ✅ Salary Distribution Chart (Bar)
- ✅ Recent Employees Table
- ✅ Department Analytics

### UI Pages
- 🔐 Login (split-screen with branding)
- 📊 Dashboard (stats, charts, tables)
- 👥 Employee List (search, sort, filter, paginate)
- 👤 Employee Details (profile card)
- ➕ Add Employee (validated form)
- ✏️ Edit Employee
- 🏢 Departments (grouped analytics)
- 📈 Reports (4 charts)
- 👤 Profile
- ⚙️ Settings

## 🏗️ Project Architecture

```
employee-management-system/
├── frontend/                 ← React + Vite
│   └── src/
│       ├── api/              ← Axios config
│       ├── components/       ← Layout (Sidebar, Header)
│       ├── context/          ← Auth Context
│       └── pages/            ← All 9 pages
├── src/main/java/.../
│   ├── config/               ← OpenAPI, WebConfig
│   ├── constant/             ← AppConstants
│   ├── controller/           ← Auth, Employee
│   ├── dto/                  ← Request/Response DTOs
│   ├── entity/               ← User, Employee, RefreshToken
│   ├── exception/            ← Global handler
│   ├── mapper/               ← EmployeeMapper
│   ├── repository/           ← JPA Repositories
│   ├── security/             ← JWT, Filter, SecurityConfig
│   └── service/              ← Auth, Employee, RefreshToken
├── Dockerfile                ← Multi-stage (Node + Java)
├── render.yaml               ← Render deployment
└── pom.xml
```

## 🛠️ Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL (or use Neon free tier)

### 1. Clone & Configure
```bash
git clone https://github.com/YOUR_USERNAME/employee-management-system.git
cd employee-management-system
```

### 2. Set up the Database
Create a PostgreSQL database named `employee_db`, or use [Neon](https://neon.tech) (free).

Update `src/main/resources/application-dev.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/employee_db
spring.datasource.username=postgres
spring.datasource.password=password
```

### 3. Run the Backend
```bash
# PowerShell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
.\mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000` (proxies API to :8080)

### 5. Login
- **Username**: `admin`
- **Password**: `admin123`

First register an admin via Swagger: `http://localhost:8080/swagger-ui.html`

## 🚢 Deployment (Render + Neon)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Employee Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/employee-management-system.git
git push -u origin main
```

### 2. Set up Neon Database
1. Go to [neon.tech](https://neon.tech) → Create Project
2. Copy the connection details

### 3. Deploy on Render
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Select **Docker** as runtime
4. Set environment variables:

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require` |
| `DATABASE_USERNAME` | Your Neon username |
| `DATABASE_PASSWORD` | Your Neon password |
| `JWT_SECRET` | A random 64+ character string |

5. Click **Create Web Service**

Your app will be live at `https://your-app.onrender.com` 🎉

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh-token` | Public | Refresh JWT |
| POST | `/api/auth/logout` | Auth | Logout |
| GET | `/api/employees/` | ADMIN | List all |
| GET | `/api/employees/{id}` | ADMIN/Owner | Get by ID |
| POST | `/api/employees/` | ADMIN | Create |
| PUT | `/api/employees/{id}` | ADMIN/Owner | Update |
| DELETE | `/api/employees/{id}` | ADMIN | Delete |
| GET | `/api/employees/search` | ADMIN | Search |
| GET | `/api/employees/department/{dept}` | ADMIN | Filter by dept |
| GET | `/api/employees/salary` | ADMIN | Filter by salary |

## 📄 License

This project is built for learning and portfolio purposes.
