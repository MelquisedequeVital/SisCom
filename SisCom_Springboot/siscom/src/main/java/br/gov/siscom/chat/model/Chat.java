package br.gov.siscom.chat.model;

import java.util.List;

import br.gov.siscom.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Chat {

    private String id;
    private List<Message> messages;
    private String subject;
    private List<User> participants;
    private Message lastMessage;
    private String urgency;
    private String requesterId;
    private String requestedDepartmentId;

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
