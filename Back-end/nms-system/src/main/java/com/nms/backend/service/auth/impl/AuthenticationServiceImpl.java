package com.nms.backend.service.auth.impl;

import com.nms.backend.dto.auth.AccountResponse;
import com.nms.backend.dto.auth.ForgotPasswordRequest;
import com.nms.backend.dto.auth.LoginRequest;
import com.nms.backend.dto.auth.RegisterRequest;
import com.nms.backend.dto.auth.EmailDetailForForgotPassword;
import com.nms.backend.dto.auth.EmailDetailForRegister;
import com.nms.backend.entity.auth.Account;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.Status;
import com.nms.backend.exceptions.exceptions.AuthenticationException;
import com.nms.backend.repository.auth.AuthenticationRepository;
import com.nms.backend.service.auth.AuthenticationService;
import com.nms.backend.service.auth.TokenService;
import com.nms.backend.service.common.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AuthenticationRepository authenticationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    private final AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    public AuthenticationServiceImpl(AuthenticationConfiguration authenticationConfiguration) {
        this.authenticationConfiguration = authenticationConfiguration;
    }

    @Override
    public Account register(RegisterRequest dto) {
        if (authenticationRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (authenticationRepository.existsByPhone(dto.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use");
        }
        if (authenticationRepository.existsByCCCD(dto.getCccd())) {
            throw new IllegalArgumentException("CCCD already in use");
        }
        if (!dto.getCccd().matches("\\d{12}")) {
            throw new IllegalArgumentException("CCCD must be exactly 12 digits");
        }

        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setFullName(dto.getFullName());
        account.setGender(dto.getGender());
        account.setDateOfBirth(dto.getDateOfBirth());
        account.setPhone(dto.getPhone());
        account.setAddress(dto.getAddress());
        account.setCCCD(dto.getCccd());
        account.setRole(Role.MEMBER);
        account.setStatus(Status.ACTIVE);

        EmailDetailForRegister emailDetailForRegister = new EmailDetailForRegister();
        emailDetailForRegister.setToEmail(dto.getEmail());
        emailDetailForRegister.setSubject("Welcome to BDS System");
        emailService.sendRegisterSuccessEmail(emailDetailForRegister);

        return authenticationRepository.save(account);
    }

    public AccountResponse login(LoginRequest loginRequest) {
        try {
            AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            ));
        } catch (Exception e) {
            throw new AuthenticationException("Invalid username or password");
        }

        Account account = authenticationRepository.findAccountByEmail(loginRequest.getEmail());
        AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
        String token = tokenService.generateToken(account);
        accountResponse.setToken(token);
        return accountResponse;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = authenticationRepository.findAccountByEmail(email);
        if (account == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return org.springframework.security.core.userdetails.User
                .withUsername(account.getEmail())
                .password(account.getPassword())
                .authorities(account.getRole().name())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        Account account = authenticationRepository.findAccountByEmail(request.getEmail());
        if (account == null) {
            throw new IllegalArgumentException("Tài khoản không tồn tại");
        } else {
            EmailDetailForForgotPassword emailDetailForForgotPassword = new EmailDetailForForgotPassword();
            emailDetailForForgotPassword.setAccount(account);
            emailDetailForForgotPassword.setSubject("Reset Password");
            emailDetailForForgotPassword.setLink("http://localhost:5432/reset-password?token=" + tokenService.generateToken(account));
            emailService.sendResetPasswordEmail(emailDetailForForgotPassword);
        }
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        Account account = tokenService.extractAccount(token);
        if (account == null) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
        account.setPassword(passwordEncoder.encode(newPassword));
        authenticationRepository.save(account);
    }

    @Override
    public Account getCurrentUser(Principal principal) throws AuthenticationException {
        if (principal == null || principal.getName() == null) {
            throw new AuthenticationException("User not authenticated");
        }

        Account account = authenticationRepository.findAccountByEmail(principal.getName());
        if (account == null) {
            throw new AuthenticationException("User not found");
        }
        return account;
    }
}
