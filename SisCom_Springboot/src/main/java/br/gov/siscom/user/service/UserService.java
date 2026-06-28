package br.gov.siscom.user.service;

import br.gov.siscom.user.model.RoleName;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@CrossOrigin(origins = "*")
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public User addUser(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        user.setRoles(Set.of(RoleName.ROLE_USER));

        return userRepository.save(user);
    }

    public User updateUser(UUID id, User user) {
        User oldUser = getUserById(id);
        Field[] fields = oldUser.getClass().getDeclaredFields();

        List<String> prohibitedFields = List.of("id", "password");

        for (Field field : fields) {
            if (prohibitedFields.contains(field.getName())) {
                continue;
            }

            field.setAccessible(true);

            try {
                Object newValue = field.get(user);

                if (newValue != null) {
                    field.set(oldUser, newValue);
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }

        return userRepository.save(oldUser);
    }
}
