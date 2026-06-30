package br.gov.siscom.department.controller;

import br.gov.siscom.department.model.dto.DepartmentRequestDTO;
import br.gov.siscom.department.model.dto.DepartmentResponseDTO;
import br.gov.siscom.department.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Endpoint público usado na tela de login/cadastro
    @GetMapping("/public-list")
    public ResponseEntity<List<DepartmentResponseDTO>> getPublicList() {
        return ResponseEntity.ok(departmentService.getPublicDepartments());
    }

    // Busca detalhada por ID (Exige autenticação)
    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(departmentService.getDepartmentById(id));
    }

    // Criação de departamento (Exige autenticação e validação de entrada)
    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> create(@RequestBody @Valid DepartmentRequestDTO dto) {
        DepartmentResponseDTO newDept = departmentService.createDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newDept);
    }

    // Atualização de departamento (Exige autenticação e validação de entrada)
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> update(@PathVariable UUID id, @RequestBody @Valid DepartmentRequestDTO dto) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, dto));
    }

    // Exclusão de departamento (Exige autenticação)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}