package br.gov.siscom.user.service;

import br.gov.siscom.user.model.enums.RoleName;
import br.gov.siscom.department.model.Department;
import br.gov.siscom.department.repository.DepartmentRepository;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.model.dto.UserCreateDTO;
import br.gov.siscom.user.model.dto.UserResponseDTO;
import br.gov.siscom.user.model.dto.UserUpdateDTO;
import br.gov.siscom.user.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.lang.reflect.Field;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@CrossOrigin(origins = "*")
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository deptRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            DepartmentRepository deptRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.deptRepository = deptRepository;
    }

    public List<UserResponseDTO> listarTodos() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO buscarPorId(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return convertToResponseDTO(user);
    }

    public UserResponseDTO adicionarUser(UserCreateDTO dto) {
        Department dept = deptRepository.findById(dto.departmentId())
                .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPhone(dto.phone());
        user.setActive(dto.active());
        user.setDepartment(dept);

        if (dto.managedDepartmentId() != null) {
            Department managedDept = deptRepository.findById(dto.managedDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento gerenciado não encontrado"));
            user.setManagedDepartment(managedDept);
        }

        String encodedPassword = passwordEncoder.encode(dto.password());
        user.setPassword(encodedPassword);

        Set<RoleName> roles = this.getRoles(dto.isAdmin(), dto.isManager());
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    public UserResponseDTO atualizarUser(UUID id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.name() != null) {
            user.setName(dto.name());
        }
        if (dto.email() != null) {
            user.setEmail(dto.email());
        }
        if (dto.phone() != null) {
            user.setPhone(dto.phone());
        }
        if (dto.active() != null) {
            user.setActive(dto.active());
        }

        if (dto.departmentId() != null) {
            Department dept = deptRepository.findById(dto.departmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));
            user.setDepartment(dept);
        }

        if (dto.managedDepartmentId() != null) {
            Department managedDept = deptRepository.findById(dto.managedDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento gerenciado não encontrado"));
            user.setManagedDepartment(managedDept);
        }

        if (dto.isAdmin() != null || dto.isManager() != null) {
            Boolean isAdmin = dto.isAdmin() != null ? dto.isAdmin() : user.getRoles().contains(RoleName.ROLE_ADMIN);
            Boolean isManager = dto.isManager() != null ? dto.isManager()
                    : user.getRoles().contains(RoleName.ROLE_MANAGER);
            user.setRoles(this.getRoles(isAdmin, isManager));
        }

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UUID deptId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        UUID managedDeptId = user.getManagedDepartment() != null ? user.getManagedDepartment().getId() : null;

        Set<String> rolesStr = user.getRoles().stream()
                .map(role -> role.name())
                .collect(Collectors.toSet());

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getPhone(),
                user.getActive(),
                deptId,
                managedDeptId,
                rolesStr);
    }

    private Set<RoleName> getRoles(Boolean isAdmin, Boolean isManager) {
        Set<RoleName> roles = new HashSet<>();

        roles.add(RoleName.ROLE_USER);

        if (Boolean.TRUE.equals(isAdmin)) {
            roles.add(RoleName.ROLE_ADMIN);
        }

        if (Boolean.TRUE.equals(isManager)) {
            roles.add(RoleName.ROLE_MANAGER);
        }

        if (Boolean.FALSE.equals(isAdmin) && Boolean.FALSE.equals(isManager)) {
            roles.add(RoleName.ROLE_USER);
        }

        return roles;
    }
}
