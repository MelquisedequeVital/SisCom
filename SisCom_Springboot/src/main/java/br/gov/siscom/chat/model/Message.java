package br.gov.siscom.chat.model;

import java.time.LocalDateTime;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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
}
