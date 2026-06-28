package br.gov.siscom.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.gov.siscom.auth.service.TokenService;
import br.gov.siscom.user.model.User;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.email(),
                loginRequest.password());
        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
        User authenticatedUser = (User) authenticationResponse.getPrincipal();
        String token = tokenService.generateToken(authenticatedUser);

        return ResponseEntity.ok(new LoginResponse(token));
    }

    public record LoginRequest(String email, String password) {
    }

    public record LoginResponse(String token) {
    }

}
