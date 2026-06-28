package br.gov.siscom.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import br.gov.siscom.department.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.siscom.user.model.User;
import org.springframework.security.core.userdetails.UserDetails;


public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<List<User>> findByDepartment(Department dept);

    Optional<User> findByEmail(String email);

    Optional<User> findById(UUID id);
}
