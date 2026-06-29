package br.gov.siscom.chat.service;

import br.gov.siscom.chat.model.Chat;
import br.gov.siscom.chat.model.Message;
import br.gov.siscom.chat.model.dto.ChatCreateDTO;
import br.gov.siscom.chat.model.dto.ChatResponseDTO;
import br.gov.siscom.chat.model.dto.MessageDTO;
import br.gov.siscom.chat.repository.ChatRepository;
import br.gov.siscom.chat.repository.MessageRepository;
import br.gov.siscom.department.model.Department;
import br.gov.siscom.department.repository.DepartmentRepository;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

        private final ChatRepository chatRepository;
        private final MessageRepository msgRepository;
        private final UserRepository userRepository;
        private final DepartmentRepository deptRepository;

        public ChatService(ChatRepository chatRepository, MessageRepository msgRepository,
                        UserRepository userRepository,
                        DepartmentRepository deptRepository) {
                this.chatRepository = chatRepository;
                this.msgRepository = msgRepository;
                this.userRepository = userRepository;
                this.deptRepository = deptRepository;
        }

        public ChatResponseDTO saveChat(ChatCreateDTO dto) {
                User requester = userRepository.findById(dto.requesterId())
                                .orElseThrow(() -> new RuntimeException("Requeridor não encontrado"));

                Department requestedDept = deptRepository.findById(dto.requestedDepartmentId())
                                .orElseThrow(() -> new RuntimeException("Departamento não encontrado"));

                List<User> usersDept = userRepository.findByDepartment(requestedDept)
                                .orElseThrow(() -> new RuntimeException("Usuários não encontrados neste departamento"));

                User requestedUser = usersDept.stream()
                                .min(Comparator.comparingInt(user -> user.getChats().size()))
                                .orElseThrow(() -> new RuntimeException(
                                                "Nenhum usuário disponível neste departamento"));

                Chat chat = new Chat();
                chat.setSubject(dto.subject());
                chat.setUrgency(dto.urgency());
                chat.setRequester(requester);
                chat.setRequestedDepartment(requestedDept);

                List<User> participants = new ArrayList<>();
                participants.add(requester);
                participants.add(requestedUser);
                chat.setParticipants(participants);

                Chat savedChat = chatRepository.save(chat);

                if (dto.firstMessage() != null && !dto.firstMessage().trim().isEmpty()) {
                        this.criarMensagemInicial(savedChat, requester, dto.firstMessage());
                }

                return convertToResponseDTO(savedChat);
        }

        private void criarMensagemInicial(Chat chat, User sender, String conteudo) {
                Message message = new Message();
                message.setContent(conteudo.trim());
                message.setChat(chat);
                message.setSender(sender);
                message.setTimestamp(LocalDateTime.now());
                message.setIsRead(false);
                message.setDeleted(false);

                Message msgSalva = msgRepository.save(message);
                chat.setLastMessage(msgSalva);
                chat.setMessages(List.of(msgSalva));
        }

        @Transactional
        public MessageDTO saveMessage(MessageDTO dto) {

                Chat chat = chatRepository.findById(dto.chatId())
                                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));
                User participant = chat.getParticipants().stream().filter(p -> p.getId().equals(dto.senderId()))
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("Usuário não pertence ao chat"));

                Message message = new Message();

                message.setContent(dto.content());

                message.setChat(chat);

                message.setSender(participant);

                message.setTimestamp(LocalDateTime.now());

                message.setIsRead(false);

                message.setDeleted(false);

                Message msgSalva = msgRepository.save(message);

                return new MessageDTO(
                                msgSalva.getId(),
                                msgSalva.getContent(),
                                msgSalva.getSender().getId(),
                                msgSalva.getChat().getId(),
                                msgSalva.getTimestamp());
        }

        public List<ChatResponseDTO> findAllChats() {
                List<Chat> chats = chatRepository.findAll();
                this.fillLastMessage(chats);
                return chats.stream()
                                .map(this::convertToResponseDTO)
                                .collect(Collectors.toList());
        }

        public ChatResponseDTO findChatById(UUID id) {
                Chat chat = chatRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));
                msgRepository.findFirstByChatIdOrderByTimestampDesc(chat.getId())
                                .ifPresent(chat::setLastMessage);
                return convertToResponseDTO(chat);
        }

        public List<ChatResponseDTO> findChatByUserId(UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                List<Chat> chats = chatRepository.findByParticipantsContaining(user);
                this.fillLastMessage(chats);

                return chats.stream()
                                .map(this::convertToResponseDTO)
                                .collect(Collectors.toList());
        }

        public ChatResponseDTO updateChat(UUID id, ChatCreateDTO dto) {
                Chat chat = chatRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Chat não encontrado"));

                if (dto.subject() != null) {
                        chat.setSubject(dto.subject());
                }
                if (dto.urgency() != null) {
                        chat.setUrgency(dto.urgency());
                }

                Chat updatedChat = chatRepository.save(chat);
                msgRepository.findFirstByChatIdOrderByTimestampDesc(updatedChat.getId())
                                .ifPresent(updatedChat::setLastMessage);
                return convertToResponseDTO(updatedChat);
        }

        public void deleteChat(UUID id) {
                chatRepository.deleteById(id);
        }

        private void fillLastMessage(List<Chat> chats) {
                for (Chat chat : chats) {
                        msgRepository.findFirstByChatIdOrderByTimestampDesc(chat.getId())
                                        .ifPresent(chat::setLastMessage);
                }
        }

        private ChatResponseDTO convertToResponseDTO(Chat chat) {
                String lastMsg = chat.getLastMessage() != null ? chat.getLastMessage().getContent() : null;

                Set<UUID> participantIds = chat.getParticipants().stream()
                                .map(User::getId)
                                .collect(Collectors.toSet());

                List<MessageDTO> msgsDto = chat.getMessages() != null ? chat.getMessages().stream()
                                .map(m -> new MessageDTO(m.getId(), m.getContent(), m.getSender().getId(), chat.getId(),
                                                m.getTimestamp()))
                                .collect(Collectors.toList()) : new ArrayList<>();

                String atendenteName = chat.getParticipants().stream()
                                .filter(p -> !p.getId().equals(chat.getRequester().getId()))
                                .map(User::getName)
                                .findFirst()
                                .orElse("Atendente");

                return new ChatResponseDTO(
                                chat.getId(),
                                chat.getSubject(),
                                chat.getUrgency(),
                                chat.getRequester().getId(),
                                chat.getRequester().getName(),
                                chat.getRequestedDepartment().getId(),
                                chat.getRequestedDepartment().getName(),
                                atendenteName,
                                participantIds,
                                lastMsg,
                                msgsDto);
        }
}