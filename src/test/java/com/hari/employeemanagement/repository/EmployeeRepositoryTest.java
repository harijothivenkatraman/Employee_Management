package com.hari.employeemanagement.repository;

import com.hari.employeemanagement.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    private Employee createSampleEmployee(String email) {
        return Employee.builder()
                .firstName("John")
                .lastName("Doe")
                .email(email)
                .department("Engineering")
                .salary(75000.0)
                .build();
    }

    @Test
    void saveEmployee_Success() {
        Employee employee = createSampleEmployee("john@test.com");
        
        Employee saved = employeeRepository.save(employee);
        
        assertNotNull(saved.getId());
        assertEquals("john@test.com", saved.getEmail());
    }

    @Test
    void findById_Success() {
        Employee employee = createSampleEmployee("test1@test.com");
        Employee saved = employeeRepository.save(employee);
        
        Optional<Employee> found = employeeRepository.findById(saved.getId());
        assertTrue(found.isPresent());
    }

    @Test
    void findByEmail_Success() {
        Employee employee = createSampleEmployee("test2@test.com");
        employeeRepository.save(employee);
        
        Optional<Employee> found = employeeRepository.findByEmail("test2@test.com");
        assertTrue(found.isPresent());
    }

    @Test
    void existsByEmail_ReturnsTrue() {
        Employee employee = createSampleEmployee("test3@test.com");
        employeeRepository.save(employee);
        
        assertTrue(employeeRepository.existsByEmail("test3@test.com"));
    }

    @Test
    void searchEmployees_FindsByName() {
        Employee employee = createSampleEmployee("test4@test.com");
        employeeRepository.save(employee);
        
        var result = employeeRepository.searchEmployees("John", PageRequest.of(0, 10));
        assertFalse(result.isEmpty());
    }

    @Test
    void deleteEmployee_Success() {
        Employee employee = createSampleEmployee("test5@test.com");
        Employee saved = employeeRepository.save(employee);
        
        employeeRepository.deleteById(saved.getId());
        
        Optional<Employee> found = employeeRepository.findById(saved.getId());
        assertFalse(found.isPresent());
    }
}
