package br.gov.siscom.chat.model.dto;

import br.gov.siscom.chat.model.enums.Urgency;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ChatResponseDTO(
    UUID id,
    String subject,
    Urgency urgency,
    UUID requesterId,
    String requesterName,
    UUID requestedDepartmentId,
    String requestedDepartmentName,
    String requestedUserName,
    Set<UUID> participantIds,
    String lastMessageContent,
    List<MessageDTO> messages
) {}