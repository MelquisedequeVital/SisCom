package br.gov.siscom.meeting.dto;

import java.util.Date;
import java.util.UUID;

public record MeetingResponseDTO(
    String id,
    String title,
    String description,
    Date startTime,
    Date endTime,
    boolean isRemote,
    String meetingLink,
    String location,
    OrganizerDTO organizer,
    String departmentId
) {}