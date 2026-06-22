package br.gov.siscom.user.model;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.department.model.Department;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "servidor_publico")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable=false)
    @NotNull(message="O departamento é obrigatório")
    private Department dept;

    @NotNull(message = "O status de administrador é obrigatório")
    @Column(nullable = false)
    private Boolean isAdmin; 

    @NotNull(message = "O status ativo é obrigatório")
    @Column(nullable = false)
    private Boolean active;

    @NotBlank(message = "O telefone é obrigatório") 
    @Column(nullable = false)
    private String phone;

    @NotNull(message = "O status de gerente é obrigatório")
    @Column(nullable = false)
    private Boolean isManager;

    @OneToOne
    @JoinColumn(name = "managed_department_id", nullable = true)
    private Department managedDepartment;

    @ManyToMany(mappedBy="participants")
    private List<Chat> chats;

    public void addChat(Chat chat){
        this.chats.add(chat);
    }

    public void removeChat(String id){
        this.chats.removeIf(chat -> chat.getId().equals(id));
    }
}
