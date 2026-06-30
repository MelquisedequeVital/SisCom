package br.gov.siscom.user.model.dto;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import br.gov.siscom.department.model.Department;

public record UserResponseDTO(
    UUID id,
    String name,
    String email,
    Boolean active,
    Department department,
    Department managedDepartment,
    Boolean isAdmin,
    Boolean isManager,
    List<String> chats,
    String phone,
    LocalDateTime createdAt
) {}