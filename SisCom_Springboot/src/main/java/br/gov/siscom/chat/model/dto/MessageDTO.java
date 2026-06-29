package br.gov.siscom.chat.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageDTO(
    UUID id,                 // Adicionado para o track do Angular
    String content, 
    UUID senderId, 
    UUID chatId,
    LocalDateTime timestamp  // Adicionado para mostrar o horário na tela
) {}
