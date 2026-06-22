package br.gov.siscom.user.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.siscom.user.model.User;

public interface UserRepository extends JpaRepository<User, UUID>{
    
}
