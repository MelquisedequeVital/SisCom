package br.gov.siscom.department.model;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

@Entity
public class Department {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @NotBlank(message="O nome é obrigatório")
    @Column(nullable=false)
    private String name;

    @NotBlank(message="O codigo do departamento é obrigatório")
    @Column(nullable=false)
    private String code;
}
