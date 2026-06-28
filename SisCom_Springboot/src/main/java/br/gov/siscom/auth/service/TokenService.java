package br.gov.siscom.auth.service;

import br.gov.siscom.user.model.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;








@Service
@NullMarked
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private static final long TOKEN_EXPIRATION_MILLIS = 7_200_000; // 2 horas em milissegundos

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        try{
            Date expirationDate = new Date(System.currentTimeMillis() + TOKEN_EXPIRATION_MILLIS);

            List<String> roles = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

            return Jwts.builder()
            .issuer("siscom-api")
            .subject(user.getUsername())
            .claim("roles", roles)
            .expiration(expirationDate)
            .signWith(getSigningKey())
            .compact();
        } catch (Exception e) {
            throw new RuntimeException("Error generating token", e);
        }
    }

    public String validateToken(String token){
        try{
            return Jwts.parser()
            .verifyWith(getSigningKey()).build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
        } catch (JwtException e) {
            return null; // Token inválido
        }
    }



}
