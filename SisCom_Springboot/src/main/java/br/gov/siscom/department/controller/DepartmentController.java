package br.gov.siscom.department.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.gov.siscom.department.model.Department;
import br.gov.siscom.department.service.DepartmentService;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "*") // Importante para o Angular conseguir acessar
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/public-list")
    public ResponseEntity<List<Department>> listarPublico() {
        List<Department> depts = departmentService.listarDepartamentos();
        return ResponseEntity.ok(depts);
    }
}
