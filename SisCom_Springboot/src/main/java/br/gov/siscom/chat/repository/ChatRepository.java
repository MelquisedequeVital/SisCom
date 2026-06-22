package br.gov.siscom.chat.repository;

import java.util.List;
import java.util.UUID;

import br.gov.siscom.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.siscom.chat.model.Chat;


public interface ChatRepository extends JpaRepository<Chat, UUID>{
    List<Chat> findByParticipantsContaining(User user);
}
