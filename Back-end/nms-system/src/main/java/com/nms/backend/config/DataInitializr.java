package com.nms.backend.config;

import com.nms.backend.entity.auth.Account;
import com.nms.backend.entity.center.Center;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.Status;
import com.nms.backend.repository.auth.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializr implements CommandLineRunner {
    @Autowired
    private AuthenticationRepository authenticationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initAdminAccount();
    }
    private void initAdminAccount() {
        if (!authenticationRepository.existsByRole(Role.ADMIN)) {
            Account admin = new Account();
            admin.setEmail("admin@system.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(Status.ACTIVE);
            admin.setFullName("Admin System");
            admin.setStatus(Status.ACTIVE);
            admin.setPhone("0000000000");
            admin.setCCCD("000000000000");
            admin.setAddress("System Default Address");
            admin.setCreateAt(LocalDateTime.now());
            authenticationRepository.save(admin);
            System.out.println("✅ Default admin account created: admin@system.com / 123456");
        }
    }
}
