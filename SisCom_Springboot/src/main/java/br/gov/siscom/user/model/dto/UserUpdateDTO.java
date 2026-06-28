package br.gov.siscom.user.model.dto;

import java.util.UUID;

public record UserUpdateDTO(
    String name,
    String email,
    String phone,
    Boolean active,
    UUID departmentId,
    UUID managedDepartmentId,
    Boolean isAdmin,
    Boolean isManager
) {}