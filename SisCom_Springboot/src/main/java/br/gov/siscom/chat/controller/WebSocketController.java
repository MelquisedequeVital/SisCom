package br.gov.siscom.chat.controller;

import br.gov.siscom.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import br.gov.siscom.chat.model.dto.MessageDTO;

@Controller
public class WebSocketController {

    private final ChatService chatService;

    WebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/messages")
    @SendTo("/queue/messages")
    public MessageDTO sendMessage(MessageDTO message){
        return chatService.saveMessage(message);
    }

    
}
