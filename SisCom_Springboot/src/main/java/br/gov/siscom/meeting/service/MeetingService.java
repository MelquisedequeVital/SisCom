package br.gov.siscom.meeting.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.gov.siscom.meeting.dto.MeetingResponseDTO; 
import br.gov.siscom.meeting.dto.OrganizerDTO;
import br.gov.siscom.meeting.model.Meeting;
import br.gov.siscom.meeting.repository.MeetingRepository;

@Service
public class MeetingService {

    @Autowired
    private MeetingRepository meetingRepository;

    @Transactional 
    public MeetingResponseDTO salvar(Meeting meeting) { 
        validarDatas(meeting);
        Meeting novaMeeting = meetingRepository.save(meeting);
        return convertToDTO(novaMeeting);
    }

    @Transactional
    public MeetingResponseDTO atualizar(String id, Meeting dadosAtualizados) { 
        validarDatas(dadosAtualizados);

        return meetingRepository.findById(id).map(meetingExistente -> {
            meetingExistente.setTitle(dadosAtualizados.getTitle());
            meetingExistente.setDescription(dadosAtualizados.getDescription());
            meetingExistente.setStartTime(dadosAtualizados.getStartTime());
            meetingExistente.setEndTime(dadosAtualizados.getEndTime());
            meetingExistente.setRemote(dadosAtualizados.isRemote());
            meetingExistente.setMeetingLink(dadosAtualizados.getMeetingLink());
            meetingExistente.setLocation(dadosAtualizados.getLocation());
            meetingExistente.setOrganizer(dadosAtualizados.getOrganizer());
            meetingExistente.setParticipants(dadosAtualizados.getParticipants());
            meetingExistente.setDepartmentId(dadosAtualizados.getDepartmentId());

            Meeting atualizada = meetingRepository.save(meetingExistente);
            return convertToDTO(atualizada);
        }).orElseThrow(() -> new IllegalArgumentException("Reunião com ID " + id + " não encontrada."));
    }

    public List<MeetingResponseDTO> listarTodas() {
        return meetingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<MeetingResponseDTO> buscarPeloId(String id) {
        return meetingRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Transactional
    public void deletar(String id) {
        meetingRepository.deleteById(id);
    }

    // Método de conversão interna para evitar referências circulares
    private MeetingResponseDTO convertToDTO(Meeting meeting) {
        OrganizerDTO organizerDTO = null;
        if (meeting.getOrganizer() != null) {
            organizerDTO = new OrganizerDTO(
                meeting.getOrganizer().getId(),
                meeting.getOrganizer().getName(),
                meeting.getOrganizer().getEmail()
            );
        }

       String linkStr = "";
        if (meeting.getMeetingLink() != null) {
            linkStr = String.valueOf(meeting.getMeetingLink());
        }

        return new MeetingResponseDTO(
            meeting.getId(),
            meeting.getTitle(),
            meeting.getDescription(),
            meeting.getStartTime(),
            meeting.getEndTime(),
            meeting.isRemote(),
            linkStr,
            meeting.getLocation(),
            organizerDTO,
            meeting.getDepartmentId()
        );
    }
    private void validarDatas(Meeting meeting) {
        if (meeting.getEndTime() != null && meeting.getStartTime() != null && 
            meeting.getEndTime().before(meeting.getStartTime())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }
    }
}