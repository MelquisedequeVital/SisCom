package br.gov.siscom.chat.model;

import java.util.List;
import java.util.UUID;

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
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


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
    @OrderBy("timestamp ASC")
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

    public Chat(UUID id, List<Message> messages, String subject, List<User> participants, Message lastMessage, Department requestedDepartment, User requester, Urgency urgency) {
        this.id = id;
        this.messages = messages;
        this.subject = subject;
        this.participants = participants;
        this.lastMessage = lastMessage;
        this.requestedDepartment = requestedDepartment;
        this.requester = requester;
        this.urgency = urgency;
    }

    public Chat() {

    }

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


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public Message getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(Message lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Urgency urgency) {
        this.urgency = urgency;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public Department getRequestedDepartment() {
        return requestedDepartment;
    }

    public void setRequestedDepartment(Department requestedDepartment) {
        this.requestedDepartment = requestedDepartment;
    }
}
