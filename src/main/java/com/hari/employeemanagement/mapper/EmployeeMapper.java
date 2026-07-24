package com.hari.employeemanagement.mapper;

import com.hari.employeemanagement.dto.EmployeeRequest;
import com.hari.employeemanagement.dto.EmployeeResponse;
import com.hari.employeemanagement.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public static Employee toEntity(EmployeeRequest dto) {
        if (dto == null) {
            return null;
        }
        return Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .salary(dto.getSalary())
                .build();
    }

    public static EmployeeResponse toResponse(Employee entity) {
        if (entity == null) {
            return null;
        }
        return EmployeeResponse.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .department(entity.getDepartment())
                .salary(entity.getSalary())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Employee entity, EmployeeRequest dto) {
        if (entity == null || dto == null) {
            return;
        }
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setDepartment(dto.getDepartment());
        entity.setSalary(dto.getSalary());
    }
}
