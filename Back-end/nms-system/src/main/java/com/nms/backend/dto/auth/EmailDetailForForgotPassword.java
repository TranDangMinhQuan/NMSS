package com.nms.backend.dto.auth;

import com.nms.backend.entity.auth.Account;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailDetailForForgotPassword {
    private Account account;
    private String subject;
    private String link;
}
