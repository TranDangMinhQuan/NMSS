package com.nms.backend.dto.auth;

import com.nms.backend.enums.Gender;
import com.nms.backend.enums.Role;
import com.nms.backend.enums.Status;
import lombok.Data;

import java.sql.Date;

@Data
public class AccountResponse {
    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private Gender gender;
    private Date dateOfBirth;
    private String phone;
    private String address;
    private Date createAt;
    private Status status;
    private String token;
}
