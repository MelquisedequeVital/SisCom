package br.gov.siscom.meeting.model;

import java.util.Date;
import java.util.List;

import br.gov.siscom.user.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "start_time", nullable = false)
    private Date startTime;

    @Column(name = "end_time", nullable = false)
    private Date endTime;

    @Column(nullable = false)
    private String title;
    private String description;

    
    @Column(name = "is_remote", nullable = false)
    private boolean isRemote;

    @Column(name = "meeting_link")
    private Boolean meetingLink;
    private String location;

    @ManyToMany
    @JoinTable(
        name = "meeting_participants",
        joinColumns = @JoinColumn(name = "meeting_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> participants;

    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    public void addParticipant(User participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(String id){
        this.participants.removeIf(participant -> participant.getId().equals(id));
    }
}
