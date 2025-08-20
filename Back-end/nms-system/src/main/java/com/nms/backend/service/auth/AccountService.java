package com.nms.backend.service.auth;

import com.nms.backend.dto.auth.AccountCreateDTO;
import com.nms.backend.dto.auth.AccountProfileDTO;
import com.nms.backend.dto.auth.AccountResponse;
import com.nms.backend.dto.auth.AccountUpdateDTO;
import com.nms.backend.entity.Account;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.Status;

import java.util.List;

public interface AccountService {
    void createByAdmin(AccountCreateDTO dto);
    void updateProfile(Account currentUser, AccountProfileDTO dto);
    Object getProfile(Account currentUser);
    void updateByAdminOrStaff(Long id, AccountUpdateDTO dto);
    List<AccountResponse> getAllByRole(Role role);
    void setSelfStatus(Long selfId, Status status);
    void staffSetStatus(Long staffId, Long targetId, Status status);
    void adminSetStatus(Long adminId, Long targetId, Status status);
}
