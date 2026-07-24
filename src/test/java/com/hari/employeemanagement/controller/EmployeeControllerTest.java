package com.hari.employeemanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hari.employeemanagement.dto.EmployeeRequest;
import com.hari.employeemanagement.dto.EmployeeResponse;
import com.hari.employeemanagement.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;
    
    @MockBean
    private Object jwtService;
    
    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    void createEmployee_ReturnsCreated() throws Exception {
        EmployeeRequest request = new EmployeeRequest();
        request.setFirstName("John");
        
        when(employeeService.createEmployee(any(EmployeeRequest.class))).thenReturn(EmployeeResponse.builder().id(1L).build());

        mockMvc.perform(post("/api/employees/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void getAllEmployees_ReturnsOk() throws Exception {
        Page<EmployeeResponse> page = new PageImpl<>(List.of(EmployeeResponse.builder().id(1L).build()));
        when(employeeService.getAllEmployees(0, 10, "id", "asc")).thenReturn(page);

        mockMvc.perform(get("/api/employees/"))
                .andExpect(status().isOk());
    }

    @Test
    void getEmployeeById_ReturnsOk() throws Exception {
        when(employeeService.getEmployeeById(1L)).thenReturn(EmployeeResponse.builder().id(1L).build());

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk());
    }

    @Test
    void getEmployeeById_NotFound_Returns404() throws Exception {
        when(employeeService.getEmployeeById(1L)).thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isNotFound()); // Depending on global exception handler
    }

    @Test
    void updateEmployee_ReturnsOk() throws Exception {
        EmployeeRequest request = new EmployeeRequest();
        
        when(employeeService.updateEmployee(eq(1L), any(EmployeeRequest.class))).thenReturn(EmployeeResponse.builder().id(1L).build());

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteEmployee_ReturnsNoContent() throws Exception {
        doNothing().when(employeeService).deleteEmployee(1L);

        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());
    }
}
