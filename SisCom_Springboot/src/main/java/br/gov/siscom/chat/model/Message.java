package br.gov.siscom.chat.model;

import java.time.LocalDateTime;
import java.util.UUID;

import br.gov.siscom.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Conteúdo da mensagem é obrigatório")
    @Column(nullable = false)
    private String content;

    @NotNull(message = "Remetente é obrigatório")
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @NotNull(message = "Chat é obrigatorio")
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @NotNull(message = "O horário da mensagem é obrigatório")
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @NotNull(message = "É necessário informar se a mensagem já foi lida")
    @Column(nullable = false)
    private Boolean isRead;

    @NotNull
    @Column(nullable = false)
    private Boolean deleted = false;

    public Message(UUID id, String content, User sender, Chat chat, LocalDateTime timestamp, Boolean isRead, Boolean deleted) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.chat = chat;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.deleted = deleted;
    }

    public Message() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean read) {
        isRead = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
