package br.gov.siscom.meeting.repository;

import br.gov.siscom.meeting.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, String> {
    
}