package com.nms.backend.dto.commons;

import com.nms.backend.entity.Account;
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
