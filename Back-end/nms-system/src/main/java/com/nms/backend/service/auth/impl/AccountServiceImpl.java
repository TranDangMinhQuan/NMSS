package com.nms.backend.service.auth.impl;

import com.nms.backend.dto.auth.AccountCreateDTO;
import com.nms.backend.dto.auth.AccountProfileDTO;
import com.nms.backend.dto.auth.AccountResponse;
import com.nms.backend.dto.auth.AccountUpdateDTO;
import com.nms.backend.entity.Account;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.Status;
import com.nms.backend.repository.auth.AccountRepository;
import com.nms.backend.service.auth.AccountService;
import com.nms.backend.service.common.EmailService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private EmailService emailService;

    // 1. Admin tạo tài khoản Staff hoặc Member
    @Override
    public void createByAdmin(AccountCreateDTO dto) {
        if (dto.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin không thể tự tạo tài khoản ADMIN khác");
        }
        if (accountRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        if (accountRepo.existsByPhone(dto.getPhone())) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng");
        }
        if (accountRepo.existsByCCCD(dto.getCCCD())) {
            throw new IllegalArgumentException("CCCD already in use");
        }
        if (!dto.getCCCD().matches("\\d{12}")) {
            throw new IllegalArgumentException("CCCD must be exactly 12 digits");
        }
        Account account = new Account();
        account.setEmail(dto.getEmail());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        account.setFullName(dto.getFullName());
        account.setGender(dto.getGender());
        account.setRole(dto.getRole());
        account.setDateOfBirth(dto.getDateOfBirth());
        account.setPhone(dto.getPhone());
        account.setAddress(dto.getAddress());
        account.setStatus(Status.ACTIVE);
        account.setCCCD(dto.getCCCD());
        emailService.sendLoginStaffAccount(dto);
        accountRepo.save(account);
    }

    // 2. Cập nhật profile của chính mình
    @Override
    public void updateProfile(Account currentUser, AccountProfileDTO dto) {
        boolean phoneInUse = accountRepo.existsByPhone(dto.getPhone())
                && !dto.getPhone().equals(currentUser.getPhone());
        if (phoneInUse) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng");
        }

        currentUser.setFullName(dto.getFullName());
        currentUser.setGender(dto.getGender());
        currentUser.setDateOfBirth(dto.getDateOfBirth());
        currentUser.setPhone(dto.getPhone());
        currentUser.setAddress(dto.getAddress());

        accountRepo.save(currentUser);
    }

    // 3. Admin hoặc Staff cập nhật thông tin hội viên
    @Override
    public void updateByAdminOrStaff(Long id, AccountUpdateDTO dto) {
        Account acc = accountRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));

        boolean phoneInUse = accountRepo.existsByPhone(dto.getPhone())
                && !dto.getPhone().equals(acc.getPhone());
        if (phoneInUse) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng");
        }

        acc.setFullName(dto.getFullName());
        acc.setGender(dto.getGender());
        acc.setDateOfBirth(dto.getDateOfBirth());
        acc.setPhone(dto.getPhone());
        acc.setAddress(dto.getAddress());

        accountRepo.save(acc);
    }

    // 5. Admin/Staff thay đổi trạng thái của tài khoản
    @Override
    public void setSelfStatus(Long targetId, Status status) {
        Account acc = accountRepo.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
        acc.setStatus(status);
        accountRepo.save(acc);
    }

    @Override
    public void staffSetStatus(Long staffId, Long targetId, Status status) {
        if (staffId.equals(targetId))
            throw new IllegalArgumentException("Staff cannot modify their own account");
        Account target = accountRepo.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("Target account not found"));
        if (target.getRole() != Role.MEMBER)
            throw new IllegalArgumentException("Staff can only modify MEMBER accounts");
        accountRepo.save(updateStatus(target, status));
    }
    @Override
    public void adminSetStatus(Long adminId, Long targetId, Status status) {
        Account target = accountRepo.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("Target account not found"));
        if (target.getRole() == Role.MEMBER)
            throw new IllegalArgumentException("Admin cannot modify MEMBER accounts");
        accountRepo.save(updateStatus(target, status));
    }
    private Account updateStatus(Account account, Status status) {
        account.setStatus(status);
        return account;
    }
    // 6. Lấy profile của chính mình
    @Override
    public Object getProfile(Account currentUser) {
        if (currentUser.getRole() == Role.MEMBER) {
            return modelMapper.map(currentUser, AccountProfileDTO.class);
        } else {
            AccountResponse response = modelMapper.map(currentUser, AccountResponse.class);
            response.setToken(null);
            return response;
        }
    }

    @Override
    public List<AccountResponse> getAllByRole(Role role) {
        List<Account> accounts = accountRepo.findAllByRole(role);
        return accounts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    public AccountResponse mapToResponse(Account account) {
        return modelMapper.map(account, AccountResponse.class);
    }
}
