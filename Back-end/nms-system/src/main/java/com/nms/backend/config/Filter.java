package com.nms.backend.config;

import com.nms.backend.entity.auth.Account;
import com.nms.backend.exceptions.exceptions.AuthenticationException;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.service.auth.impl.TokenServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class Filter extends OncePerRequestFilter {

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    @Autowired
    private TokenServiceImpl tokenService;

    @Autowired
    private AccountRepository accountRepository;

    // Danh sách API public (không cần token)
    private final List<String> PUBLIC_API = List.of(
            "POST:/api/register",
            "POST:/api/login",
            // Forgot/reset password (public)
            "POST:/api/forgot-password-request",
            "POST:/api/reset-password-request",
            "GET:/swagger-ui/**",
            "GET:/v3/api-docs",
            "GET:/v3/api-docs/**",
            "GET:/swagger-resources/**",
            "GET:/webjars/**",
            "GET:/swagger-ui.html",
            "GET:/favicon.ico",
            "POST:/api/auth/forgot-password",
            "POST:/api/auth/reset-password",
            "GET:/ws/**");

    private boolean isPublicAPI(String uri, String method) {
        AntPathMatcher matcher = new AntPathMatcher();
        return PUBLIC_API.stream().anyMatch(pattern -> {
            String[] parts = pattern.split(":", 2);
            if (parts.length != 2)
                return false;
            String allowedMethod = parts[0];
            String allowedUri = parts[1];
            return method.equalsIgnoreCase(allowedMethod) && matcher.match(allowedUri, uri);
        });
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (isPublicAPI(uri, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getToken(request);
        if (token == null) {
            resolver.resolveException(request, response, null, new AuthenticationException("Empty token!"));
            return;
        }

        try {
            // Extract minimal account (contains email + role) from token, then load full entity from DB
            Account tokenAccount = tokenService.extractAccount(token);
            Account account = accountRepository.findAccountByEmail(tokenAccount.getEmail());
            if (account == null) {
                resolver.resolveException(request, response, null, new AuthenticationException("User not found"));
                return;
            }
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(account, token,
                    account.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            resolver.resolveException(request, response, null, new AuthenticationException("Expired Token!"));
        } catch (MalformedJwtException e) {
            resolver.resolveException(request, response, null, new AuthenticationException("Invalid Token!"));
        }
    }

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
