package br.gov.siscom.chat.controller;

import java.util.List;
import java.util.UUID;

import br.gov.siscom.chat.model.dto.ChatCreateDTO;
import br.gov.siscom.chat.model.dto.ChatResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.gov.siscom.chat.service.ChatService;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    @GetMapping
    public ResponseEntity<List<ChatResponseDTO>> getAllChats() {
        return ResponseEntity.ok(chatService.findAllChats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatResponseDTO> getChatById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(chatService.findChatById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(params = "userId")
    public ResponseEntity<List<ChatResponseDTO>> getAllChatsByUserId(@RequestParam UUID userId) {
        try {
            List<ChatResponseDTO> chats = chatService.findChatByUserId(userId);
            return ResponseEntity.ok(chats);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChatResponseDTO addChat(@RequestBody @Valid ChatCreateDTO dto) {
        return chatService.saveChat(dto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ChatResponseDTO> editChat(@PathVariable UUID id, @RequestBody ChatCreateDTO dto) {
        try {
            ChatResponseDTO chatAtualizado = chatService.updateChat(id, dto);
            return ResponseEntity.ok(chatAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable UUID id) {
        try {
            chatService.findChatById(id);
            chatService.deleteChat(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}