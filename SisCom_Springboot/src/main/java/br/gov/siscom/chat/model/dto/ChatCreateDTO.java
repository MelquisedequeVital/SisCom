package br.gov.siscom.chat.model.dto;

import br.gov.siscom.chat.model.enums.Urgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ChatCreateDTO(
    @NotBlank(message = "Motivo do Chat é obrigatório") String subject,
    @NotNull(message = "Urgência do Chat é obrigatório") Urgency urgency,
    @NotNull(message = "Requeridor do Chat é obrigatório") UUID requesterId,
    @NotNull(message = "Departamento requerido é obrigatório") UUID requestedDepartmentId
) {}