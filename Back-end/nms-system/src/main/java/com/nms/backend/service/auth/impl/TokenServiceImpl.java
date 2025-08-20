package com.nms.backend.service.auth.impl;

import com.nms.backend.entity.Account;
import com.nms.backend.enums.Role;
import com.nms.backend.service.auth.TokenService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class TokenServiceImpl implements TokenService {

    private static final String SECRET_KEY = "your-very-secret-and-long-secret-key-should-be-at-least-32-chars";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 giờ

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    @Override
    public String generateToken(Account account) {
        return Jwts.builder()
                .setSubject(account.getEmail())
                .claim("role", account.getRole())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public Account extractAccount(String token) {
        Claims claims = extractAllClaims(token);
        Account account = new Account();
        account.setEmail(claims.getSubject());
        account.setRole(Role.valueOf(claims.get("role", String.class)));
        return account;
    }

    @Override
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    @Override
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }
}
