package br.gov.siscom.department.service;

import br.gov.siscom.department.model.Department;
import br.gov.siscom.department.model.dto.DepartmentRequestDTO;
import br.gov.siscom.department.model.dto.DepartmentResponseDTO;
import br.gov.siscom.department.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponseDTO> getPublicDepartments() {
        return departmentRepository.findAll().stream()
                .map(dept -> new DepartmentResponseDTO(dept.getId(), dept.getName(), dept.getCode()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponseDTO getDepartmentById(UUID id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado com o ID fornecido."));
        return new DepartmentResponseDTO(dept.getId(), dept.getName(), dept.getCode());
    }

    @Transactional
    public DepartmentResponseDTO createDepartment(DepartmentRequestDTO dto) {
        Department dept = new Department();
        dept.setName(dto.name());
        dept.setCode(dto.code());
        
        Department savedDept = departmentRepository.save(dept);
        return new DepartmentResponseDTO(savedDept.getId(), savedDept.getName(), savedDept.getCode());
    }

    @Transactional
    public DepartmentResponseDTO updateDepartment(UUID id, DepartmentRequestDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado para atualização."));
        
        dept.setName(dto.name());
        dept.setCode(dto.code());
        
        Department updatedDept = departmentRepository.save(dept);
        return new DepartmentResponseDTO(updatedDept.getId(), updatedDept.getName(), updatedDept.getCode());
    }

    @Transactional
    public void deleteDepartment(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Departamento não encontrado para exclusão.");
        }
        departmentRepository.deleteById(id);
    }
}