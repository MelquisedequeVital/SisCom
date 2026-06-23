package br.gov.siscom.chat.model.dto;

import java.util.UUID;

public record MessageDTO(String content, UUID senderId, UUID chatId) {}
