package br.gov.siscom.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.gov.siscom.auth.service.TokenService;
import br.gov.siscom.user.model.User;
import br.gov.siscom.user.model.dto.UserResponseDTO;
import br.gov.siscom.user.service.UserService;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.email(),
                loginRequest.password());
        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
        User authenticatedUser = (User) authenticationResponse.getPrincipal();
        UserResponseDTO userResponse = userService.convertToResponseDTO(authenticatedUser);
        String token = tokenService.generateToken(authenticatedUser);

        return ResponseEntity.ok(new LoginResponse(token, userResponse));
    }

    public record LoginRequest(String email, String password) {
    }

    public record LoginResponse(String token, UserResponseDTO user) {
    }

}
