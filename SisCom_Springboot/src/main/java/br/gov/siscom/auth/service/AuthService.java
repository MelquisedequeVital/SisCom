package br.gov.siscom.auth.service;

import br.gov.siscom.auth.controller.AuthController.LoginRequest;
import br.gov.siscom.auth.controller.AuthController.LoginResponse;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@NullMarked
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
 
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        return userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    };


}
