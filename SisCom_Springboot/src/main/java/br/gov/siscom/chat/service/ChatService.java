package br.gov.siscom.chat.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.chat.model.Message;
import br.gov.siscom.chat.model.dto.MessageDTO;
import br.gov.siscom.chat.repository.ChatRepository;
import br.gov.siscom.chat.repository.MessageRepository;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository msgRepository;
    private final UserRepository userRepository;

    public ChatService(ChatRepository chatRepository, MessageRepository msgRepository, UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.msgRepository = msgRepository;
        this.userRepository = userRepository;
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

    public MessageDTO saveMessage(MessageDTO dto) {
        Chat chat = chatRepository.findById(dto.getChatId()).orElseThrow(() -> new RuntimeException("Chat não encontrado"));
        User sender = userRepository.findById(dto.getSenderId()).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Message message = new Message();
        message.setContent(dto.getContent());
        message.setChat(chat);
        message.setSender(sender);
        message.setTimestamp(LocalDateTime.now());
        message.setIsRead(false);
        message.setDeleted(false);

        msgRepository.save(message);

        return dto;
    }

    public void deleteChat(UUID id) {
        chatRepository.deleteById(id);
    }
}
