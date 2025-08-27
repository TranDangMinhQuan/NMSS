package com.nms.backend.repository.auth;

import com.nms.backend.entity.auth.Account;
import com.nms.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findAllByRole(Role role);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByCCCD(String cccd);
    boolean existsByEmailAndPhone(String email, String phone);
    Account findAccountByEmail(String email);
}
