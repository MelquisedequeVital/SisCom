package br.gov.siscom.meeting.model;

import java.util.Date;
import java.util.List;

import br.gov.siscom.user.model.User;
import jakarta.persistence.*;


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

    public Meeting(String id, Date endTime, Date startTime, String title, String description, List<User> participants, String location, boolean isRemote, User organizer, Boolean meetingLink) {
        this.id = id;
        this.endTime = endTime;
        this.startTime = startTime;
        this.title = title;
        this.description = description;
        this.participants = participants;
        this.location = location;
        this.isRemote = isRemote;
        this.organizer = organizer;
        this.meetingLink = meetingLink;
    }

    public Meeting() {
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isRemote() {
        return isRemote;
    }

    public void setRemote(boolean remote) {
        isRemote = remote;
    }

    public Boolean getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(Boolean meetingLink) {
        this.meetingLink = meetingLink;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public void addParticipant(User participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(String id){
        this.participants.removeIf(participant -> participant.getId().equals(id));
    }
}
