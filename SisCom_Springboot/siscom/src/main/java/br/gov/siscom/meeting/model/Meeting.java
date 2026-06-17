package br.gov.siscom.meeting.model;

import java.util.Date;
import java.util.List;

import br.gov.siscom.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Meeting {
    private String id;
    private Date startTime;
    private Date endTime;
    private String title;
    private String description;
    private List<User> participants;
    private String location;
    private boolean isRemote;
    private Boolean meetingLink;
    private User organizer;

    public void addParticipant(User participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(String id){
        this.participants.removeIf(participant -> participant.getId().equals(id));
    }
}
