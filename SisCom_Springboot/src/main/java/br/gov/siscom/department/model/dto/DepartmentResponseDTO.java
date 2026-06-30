package br.gov.siscom.department.model.dto;

import java.util.UUID;

public record DepartmentResponseDTO(UUID id, String name, String code) {}