package br.gov.siscom.department.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.gov.siscom.department.model.Department;
import br.gov.siscom.department.repository.DepartmentRepository;

@Service
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository){
        this.departmentRepository = departmentRepository;
    }

    public List<Department> listarDepartamentos(){
        return departmentRepository.findAll();
    }
}
