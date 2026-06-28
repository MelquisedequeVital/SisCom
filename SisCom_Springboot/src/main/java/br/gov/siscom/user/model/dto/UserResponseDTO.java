package br.gov.siscom.user.model.dto;

import java.util.Set;
import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String name,
    String email,
    String phone,
    Boolean active,
    UUID departmentId,
    UUID managedDepartmentId,
    Set<String> roles 
) {}