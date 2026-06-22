package br.gov.siscom.chat.model;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import br.gov.siscom.chat.model.enums.Urgency;
import br.gov.siscom.department.model.Department;
import br.gov.siscom.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
public class Chat {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;

    @OneToMany(mappedBy="chat",fetch=FetchType.LAZY)
    private List<Message> messages;

    @NotBlank(message = "Motivo do Chat é obrigatório")
    @Column(nullable = false)
    private String subject;

    @ManyToMany
    @JoinTable(
        name = "chat_participants",
        joinColumns = @JoinColumn(name= "chat_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> participants;

    @Transient
    private Message lastMessage;

    @NotNull(message = "Urgência do Chat é obrigatório")
    @Column(nullable = false)
    private Urgency urgency;

    @NotNull(message = "Requeridor do Chat é obrigatório")
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @NotNull(message = "Departamento requerido é obrigatório")
    @ManyToOne
    @JoinColumn(name="requested_department_id", nullable=false)
    private Department requestedDepartment;

    public void addMessage(Message message) {
        this.messages.add(message);
    }

    public void removeMessage(String id) {
        // List<Message> modifiedMessages = this.messages.stream().filter(message -> !message.getId().equals(id)).collect(Collectors.toList());
        // this.messages = modifiedMessages;
        this.messages.removeIf(message -> message.getId().equals(id));
    }

    public void addParticipant(User participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(String id) {
        // List<User> modifiedUsers = this.participants.stream().filter(partcipant -> !partcipant.getId().equals(id)).collect(Collectors.toList());
        // this.participants = modifiedUsers;
        this.participants.removeIf(participant -> participant.getId().equals(id));
    }
}
