package com.nms.backend.repository.auth;

import com.nms.backend.entity.Account;
import com.nms.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthenticationRepository extends JpaRepository<Account, Long> {
    Account findAccountByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByCCCD(String cccd);
    Optional<Account> findByEmail(String email);
    boolean existsByRole(Role role);

}
