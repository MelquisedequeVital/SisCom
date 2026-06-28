package br.gov.siscom.user.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserCreateDTO(
    @NotBlank(message = "O nome é obrigatório") String name,
    @NotBlank(message = "O email é obrigatório") @Email(message = "Email inválido") String email,
    @NotBlank(message = "A senha é obrigatória") String password,
    @NotBlank(message = "O telefone é obrigatório") String phone,
    @NotNull(message = "O status ativo é obrigatório") Boolean active,
    @NotNull(message = "O departamento é obrigatório") UUID departmentId,
    UUID managedDepartmentId,
    Boolean isAdmin,
    Boolean isManager
) {}