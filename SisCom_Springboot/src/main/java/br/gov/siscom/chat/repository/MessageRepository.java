package br.gov.siscom.chat.repository;


import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.siscom.chat.model.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    Optional<Message> findFirstByChatIdOrderByTimestampDesc(UUID id);
}
