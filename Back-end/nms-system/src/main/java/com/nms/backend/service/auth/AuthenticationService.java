package com.nms.backend.service.auth;

import com.nms.backend.dto.auth.AccountResponse;
import com.nms.backend.dto.auth.ForgotPasswordRequest;
import com.nms.backend.dto.auth.LoginRequest;
import com.nms.backend.dto.auth.RegisterRequest;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.exceptions.exceptions.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.security.Principal;

public interface AuthenticationService extends UserDetailsService {
    Account register(RegisterRequest dto);
    AccountResponse login(LoginRequest loginRequest);
    UserDetails loadUserByUsername(String email);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(String token, String newPassword);
    Account getCurrentUser(Principal principal) throws AuthenticationException;
}
