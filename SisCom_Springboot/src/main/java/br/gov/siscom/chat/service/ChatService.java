package br.gov.siscom.chat.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.chat.model.Message;
import br.gov.siscom.chat.repository.ChatRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ChatService {

    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public Chat saveChat(Chat chat) {
        return chatRepository.save(chat);
    }

    public List<Chat> findAllChats() {
        return chatRepository.findAll();
    }

    public Optional<Chat> findChatById(UUID id) {
        return chatRepository.findById(id);
    }

    public Chat updateChat(UUID id, Chat chatDetails) {
        Chat chatExistente = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));

        // Copia todos os atributos de 'chatDetails' para 'chatExistente', 
        // mas IGNORA o campo 'id' para não bagunçar a chave primária.
        BeanUtils.copyProperties(chatDetails, chatExistente, "id");

        return chatRepository.save(chatExistente);
    }

    public Message saveMessage(Message message){
        Chat chatPai = chatRepository.findById(message.getChat().getId()).orElseThrow(() -> new EntityNotFoundException("Chat não encontrado"));
        
        chatPai.addMessage(message);

        chatRepository.save(chatPai);

        return message;
    }

    public void deleteChat(UUID id) {
        chatRepository.deleteById(id);
    }
}
