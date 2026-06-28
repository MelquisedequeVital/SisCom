package br.gov.siscom.meeting.service;

import br.gov.siscom.meeting.model.Meeting;
import br.gov.siscom.meeting.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    public Meeting salvar(Meeting meeting) {
        if (meeting.getEndTime()!= null && meeting.getStartTime() != null && 
        meeting.getEndTime().before(meeting.getStartTime())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }
        return meetingRepository.save(meeting);
    }

    public List<Meeting> listarTodas() {
        return meetingRepository.findAll();
    }

    public Optional<Meeting> buscarPeloId(String id) {
        return meetingRepository.findById(id);
    }

    public void deletar(String id) {
        meetingRepository.deleteById(id);
    }
}