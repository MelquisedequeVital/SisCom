package br.gov.siscom.meeting.service;

import br.gov.siscom.meeting.model.Meeting;
import br.gov.siscom.meeting.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 🌟 Importado

import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {
    @Autowired
    private MeetingRepository meetingRepository;

    @Transactional // 🌟 Garante atomicidade e persistência correta no banco
    public Meeting salvar(Meeting meeting) {
        validarDatas(meeting);
        return meetingRepository.save(meeting);
    }

    // 🌟 NOVO MÉTODO: Use este método no seu Controller para requisições PUT (Atualizar)
    @Transactional
    public Meeting atualizar(String id, Meeting dadosAtualizados) {
        validarDatas(dadosAtualizados);

        // 1. Busca a reunião que já existe no banco pelo ID correto
        return meetingRepository.findById(id).map(meetingExistente -> {
            // 2. Atualiza os campos mantendo o mesmo ID do banco
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

            // 3. Salva a entidade existente modificada (Gera o UPDATE no banco)
            return meetingRepository.save(meetingExistente);
        }).orElseThrow(() -> new IllegalArgumentException("Reunião com ID " + id + " não encontrada."));
    }

    public List<Meeting> listarTodas() {
        return meetingRepository.findAll();
    }

    public Optional<Meeting> buscarPeloId(String id) {
        return meetingRepository.findById(id);
    }

    @Transactional
    public void deletar(String id) {
        meetingRepository.deleteById(id);
    }

    // Isola a validação para evitar repetição de código
    private void validarDatas(Meeting meeting) {
        if (meeting.getEndTime() != null && meeting.getStartTime() != null && 
            meeting.getEndTime().before(meeting.getStartTime())) {
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
        }
    }
}