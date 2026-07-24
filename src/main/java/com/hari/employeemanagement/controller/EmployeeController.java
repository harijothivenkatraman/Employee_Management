package com.hari.employeemanagement.controller;

import com.hari.employeemanagement.dto.EmployeeRequest;
import com.hari.employeemanagement.dto.EmployeeResponse;
import com.hari.employeemanagement.entity.User;
import com.hari.employeemanagement.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Operation(summary = "Create a new employee")
    @ApiResponse(responseCode = "201", description = "Employee created")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createEmployee(request));
    }

    @Operation(summary = "Get all employees")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(employeeService.getAllEmployees(pageNo, pageSize, sortBy, sortDir));
    }

    @Operation(summary = "Get employee by ID")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @ApiResponse(responseCode = "404", description = "Employee not found")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and @employeeController.isOwner(#id, authentication))")
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @Operation(summary = "Update employee details")
    @ApiResponse(responseCode = "200", description = "Employee updated")
    @ApiResponse(responseCode = "404", description = "Employee not found")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and @employeeController.isOwner(#id, authentication))")
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }

    @Operation(summary = "Delete an employee")
    @ApiResponse(responseCode = "204", description = "Employee deleted")
    @ApiResponse(responseCode = "404", description = "Employee not found")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Search employees by keyword")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(employeeService.searchEmployees(keyword, pageNo, pageSize, sortBy, sortDir));
    }

    @Operation(summary = "Get employees by department")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/department/{department}")
    public ResponseEntity<Page<EmployeeResponse>> getEmployeesByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(department, pageNo, pageSize, sortBy, sortDir));
    }

    @Operation(summary = "Get employees by salary range")
    @ApiResponse(responseCode = "200", description = "Successful operation")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/salary")
    public ResponseEntity<Page<EmployeeResponse>> getEmployeesBySalaryRange(
            @RequestParam Double min,
            @RequestParam Double max,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(employeeService.getEmployeesBySalaryRange(min, max, pageNo, pageSize, sortBy, sortDir));
    }

    public boolean isOwner(Long employeeId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        if (authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user.getEmployeeId() != null && user.getEmployeeId().equals(employeeId);
        }
        return false;
    }
}
