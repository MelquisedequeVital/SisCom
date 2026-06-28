package br.gov.siscom.department.model;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;



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

    public Department(UUID id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    public Department() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}
