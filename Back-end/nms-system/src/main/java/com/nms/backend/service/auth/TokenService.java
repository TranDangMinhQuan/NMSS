package com.nms.backend.service.auth;

import com.nms.backend.entity.Account;
import io.jsonwebtoken.Claims;

import java.util.Date;
import java.util.function.Function;

public interface TokenService {
    String generateToken(Account account);
    Claims extractAllClaims(String token);
    Account extractAccount(String token);
    boolean isTokenExpired(String token);
    Date extractExpiration(String token);
    <T> T extractClaim(String token, Function<Claims, T> resolver);
}
