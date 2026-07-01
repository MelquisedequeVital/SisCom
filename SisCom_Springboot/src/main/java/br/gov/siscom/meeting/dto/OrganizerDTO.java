package br.gov.siscom.meeting.dto;

import java.util.UUID;

public record OrganizerDTO(
    UUID id,
    String name,
    String email
) {}