package br.gov.siscom.department.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentRequestDTO(
    @NotBlank(message = "O nome do departamento é obrigatório.")
    @Size(min = 3, max = 255, message = "O nome deve ter entre 3 e 255 caracteres.")
    String name,

    @NotBlank(message = "O código do departamento é obrigatório.")
    @Size(min = 2, max = 50, message = "O código deve ter entre 2 e 50 caracteres.")
    String code
) {}