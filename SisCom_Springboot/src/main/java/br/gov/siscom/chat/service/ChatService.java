package br.gov.siscom.chat.service;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;

import br.gov.siscom.department.model.Department;
import org.springframework.stereotype.Service;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.chat.model.Message;
import br.gov.siscom.chat.model.dto.MessageDTO;
import br.gov.siscom.chat.repository.ChatRepository;
import br.gov.siscom.chat.repository.MessageRepository;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.repository.UserRepository;

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
        Department requestedDept = chat.getRequestedDepartment();
        List<User> usersDept = userRepository.findByDepartment((requestedDept)).orElseThrow(() -> new RuntimeException("Departments not found"));
        User requestedUser = usersDept.stream()
                .min(Comparator.comparingInt(user -> user.getChats().size()))
                .orElseThrow(() -> new RuntimeException("Nenhum usuário disponível neste departamento"));

        List<User> participants = new ArrayList<>(chat.getParticipants());

        participants.add(requestedUser);

        chat.setParticipants(participants);

        return chatRepository.save(chat);
    }

    public List<Chat> findAllChats() {
        List<Chat> chats = chatRepository.findAll();

        this.fillLastMessage(chats);

        return chats;
    }

    public Optional<Chat> findChatById(UUID id) {
        return chatRepository.findById(id);
    }

    public List<Chat> findChatByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<Chat> chats = chatRepository.findByParticipantsContaining(user);

        this.fillLastMessage(chats);

        return chats;
    }

    public Chat updateChat(UUID id, Chat chatDetails) {
        Chat modifiedChat = chatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));

        Field[] fields = chatDetails.getClass().getDeclaredFields();

        List<String> prohibitedFields = List.of("id", "requester", "participants", "requestedDepartment");

        try {
            for (Field field : fields) {
                field.setAccessible(true);

                if (prohibitedFields.contains(field.getName())) {
                    continue;
                }

                Object valorNovo = field.get(chatDetails);

                if (valorNovo != null) {
                    field.set(modifiedChat, valorNovo);
                }
            }


        } catch (IllegalAccessException e) {
            throw new RuntimeException("Erro ao processar a atualização dos campos do chat", e);
        }

        return chatRepository.save(modifiedChat);
    }

    private void fillLastMessage(List<Chat> chats) {
        for (Chat chat : chats) {
            msgRepository.findFirstByChatIdOrderByTimestampDesc(chat.getId())
                    .ifPresent(chat::setLastMessage);
        }
    }

    public MessageDTO saveMessage(MessageDTO dto) {
        Chat chat = chatRepository.findById(dto.chatId()).orElseThrow(() -> new RuntimeException("Chat não encontrado"));
        User participant = chat.getParticipants().stream().filter(p -> p.getId().equals(dto.senderId())).findFirst().orElseThrow(() -> new RuntimeException("Usuário não pertence ao chat"));

        Message message = new Message();
        message.setContent(dto.content());
        message.setChat(chat);
        message.setSender(participant);
        message.setTimestamp(LocalDateTime.now());
        message.setIsRead(false);
        message.setDeleted(false);

        return dto;
    }

    public void deleteChat(UUID id) {
        chatRepository.deleteById(id);
    }
}
