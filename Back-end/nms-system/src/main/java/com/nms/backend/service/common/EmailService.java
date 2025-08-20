package com.nms.backend.service.common;

import com.nms.backend.dto.auth.AccountCreateDTO;
import com.nms.backend.dto.commons.EmailDetailForForgotPassword;
import com.nms.backend.dto.commons.EmailDetailForRegister;

import java.time.LocalDate;

public interface EmailService {
    void sendRegisterSuccessEmail(EmailDetailForRegister emailDetail);
    void sendResetPasswordEmail(EmailDetailForForgotPassword emailDetailForForgotPassword);
    void sendLoginStaffAccount(AccountCreateDTO emailDetail);
}
