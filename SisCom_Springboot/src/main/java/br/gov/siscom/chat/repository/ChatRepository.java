package br.gov.siscom.chat.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.siscom.chat.model.Chat;


public interface ChatRepository extends JpaRepository<Chat, UUID>{
    
}
