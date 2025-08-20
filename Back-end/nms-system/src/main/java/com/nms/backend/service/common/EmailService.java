package com.nms.backend.service.common;

import com.nms.backend.dto.auth.AccountCreateDTO;
import com.nms.backend.dto.auth.EmailDetailForForgotPassword;
import com.nms.backend.dto.auth.EmailDetailForRegister;

public interface EmailService {
    void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail);
    void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword);
    void sendLoginStaffAccount(AccountCreateDTO emailDetail);
}
