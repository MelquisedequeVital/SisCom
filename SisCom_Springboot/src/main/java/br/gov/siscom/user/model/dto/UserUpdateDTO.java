package br.gov.siscom.user.model.dto;

import java.util.UUID;

public record UserUpdateDTO(
    String name,
    String email,
    Boolean active,
    UUID departmentId,
    UUID managedDepartmentId,
    Boolean isAdmin,
    Boolean isManager,
    String phone
) {}