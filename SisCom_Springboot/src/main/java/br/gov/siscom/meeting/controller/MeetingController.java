package br.gov.siscom.meeting.controller;

import br.gov.siscom.meeting.model.Meeting;
import br.gov.siscom.meeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("api/meetings")
@CrossOrigin(origins = "http://localhost:5173")
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @GetMapping
    public ResponseEntity<List<Meeting>> getAll() {
        return ResponseEntity.ok(meetingService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getById(@PathVariable String id) {
        return meetingService.buscarPeloId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Meeting meeting) {
        try {
            Meeting novaReuniao = meetingService.salvar(meeting);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaReuniao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (meetingService.buscarPeloId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        meetingService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
