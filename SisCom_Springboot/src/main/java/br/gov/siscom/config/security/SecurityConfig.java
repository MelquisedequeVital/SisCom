package br.gov.siscom.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desativa a proteção CSRF (essencial para testar POST/WebSockets via clients externos)
                .csrf(csrf -> csrf.disable())
                // 2. Configuração de rotas
                .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
                );

        return http.build();
    }
}
