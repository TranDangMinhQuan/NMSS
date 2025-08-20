package com.nms.backend.dto.auth;



import com.nms.backend.enums.Gender;
import com.nms.backend.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.sql.Date;

@Data
public class   AccountCreateDTO {

    private String subject;

    @NotBlank(message = "Email owner is required")
    private String emailOwner;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "CCCD is required")
    private String CCCD;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Blood type is required")
    private Long bloodTypeId;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private Date dateOfBirth;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0[0-9]{9})$", message = "Phone number must start with 0 and have 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;
}
