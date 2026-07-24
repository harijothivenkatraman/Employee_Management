package com.hari.employeemanagement.service;

import com.hari.employeemanagement.dto.EmployeeRequest;
import com.hari.employeemanagement.dto.EmployeeResponse;
import com.hari.employeemanagement.entity.Employee;
import com.hari.employeemanagement.exception.DuplicateResourceException;
import com.hari.employeemanagement.exception.ResourceNotFoundException;
import com.hari.employeemanagement.mapper.EmployeeMapper;
import com.hari.employeemanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        log.info("Creating new employee with email: {}", request.getEmail());
        
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Employee", "email", request.getEmail());
        }

        Employee employee = EmployeeMapper.toEntity(request);
        Employee savedEmployee = employeeRepository.save(employee);
        log.debug("Employee created with id: {}", savedEmployee.getId());
        return EmployeeMapper.toResponse(savedEmployee);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        log.debug("Fetching employee by id: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return EmployeeMapper.toResponse(employee);
    }

    public Page<EmployeeResponse> getAllEmployees(int pageNo, int pageSize, String sortBy, String sortDir) {
        log.debug("Fetching all employees page: {}, size: {}", pageNo, pageSize);
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        return employeeRepository.findAll(pageable).map(EmployeeMapper::toResponse);
    }

    public Page<EmployeeResponse> searchEmployees(String keyword, int pageNo, int pageSize, String sortBy, String sortDir) {
        log.debug("Searching employees with keyword: {}", keyword);
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        return employeeRepository.searchEmployees(keyword, pageable).map(EmployeeMapper::toResponse);
    }

    public Page<EmployeeResponse> getEmployeesByDepartment(String department, int pageNo, int pageSize, String sortBy, String sortDir) {
        log.debug("Fetching employees by department: {}", department);
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        return employeeRepository.findByDepartmentIgnoreCase(department, pageable).map(EmployeeMapper::toResponse);
    }

    public Page<EmployeeResponse> getEmployeesBySalaryRange(Double minSalary, Double maxSalary, int pageNo, int pageSize, String sortBy, String sortDir) {
        log.debug("Fetching employees by salary range: {} - {}", minSalary, maxSalary);
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        
        return employeeRepository.findBySalaryBetween(minSalary, maxSalary, pageable).map(EmployeeMapper::toResponse);
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        log.info("Updating employee with id: {}", id);
        
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        if (!employee.getEmail().equals(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Employee", "email", request.getEmail());
        }

        EmployeeMapper.updateEntity(employee, request);
        Employee updatedEmployee = employeeRepository.save(employee);
        log.debug("Employee updated successfully");
        return EmployeeMapper.toResponse(updatedEmployee);
    }

    public void deleteEmployee(Long id) {
        log.info("Deleting employee with id: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
        log.debug("Employee deleted successfully");
    }
}
