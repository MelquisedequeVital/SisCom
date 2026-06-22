package br.gov.siscom.chat.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.chat.service.ChatService;

@RestController
@RequestMapping("api/siscom/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    @GetMapping
    public List<Chat> getAllChats() {
        return chatService.findAllChats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> getChatById(@PathVariable UUID id) {
        return chatService.findChatById(id)
                .map(chat -> ResponseEntity.ok(chat))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Chat addChat(@RequestBody Chat chat) {
        return chatService.saveChat(chat);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Chat> editChat(@PathVariable UUID id, @RequestBody Chat chatDetails) {
        try {
            Chat chatAtualizado = chatService.updateChat(id, chatDetails);
            return ResponseEntity.ok(chatAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable UUID id) {
        return chatService.findChatById(id)
                .map(chat -> {
                    chatService.deleteChat(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}