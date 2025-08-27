package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServicePackageDTO;
import com.nms.backend.service.center.ServicePackageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-packages")
@RequiredArgsConstructor
@SecurityRequirement(name = "api")
public class ServicePackageAPI {

    private final ServicePackageService servicePackageService;

    // Chỉ cho phép ROLE_ADMIN tạo mới gói dịch vụ
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ServicePackageDTO> createServicePackage(@RequestBody ServicePackageDTO dto) {
        ServicePackageDTO createdDto = servicePackageService.create(dto);
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }

    // Chỉ cho phép ROLE_ADMIN cập nhật gói dịch vụ
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ServicePackageDTO> updateServicePackage(@PathVariable Long id, @RequestBody ServicePackageDTO dto) {
        ServicePackageDTO updatedDto = servicePackageService.update(id, dto);
        return ResponseEntity.ok(updatedDto);
    }

    // Chỉ cho phép ROLE_ADMIN xóa mềm gói dịch vụ
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteServicePackage(@PathVariable Long id) {
        servicePackageService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    // Bất kỳ ai cũng có thể xem các gói dịch vụ đang hoạt động
    // có thể là ROLE_ADMIN hoặc ROLE_USER
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/active")
    public ResponseEntity<List<ServicePackageDTO>> getAllActiveServicePackages() {
        List<ServicePackageDTO> packages = servicePackageService.getAllActive();
        return ResponseEntity.ok(packages);
    }

    // Chỉ cho phép ROLE_ADMIN hoặc ROLE_USER xem một gói dịch vụ cụ thể
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ServicePackageDTO> getServicePackageById(@PathVariable Long id) {
        ServicePackageDTO packageDto = servicePackageService.getById(id);
        return ResponseEntity.ok(packageDto);
    }

    // Chỉ cho phép ROLE_ADMIN xem tất cả gói dịch vụ (kể cả những cái đã xóa mềm)
    // Dựa trên serviceImpl của bạn, có thể bạn sẽ cần thêm một phương thức getAll vào ServicePackageService
    // Nếu bạn đã có phương thức getAll(), bạn có thể uncomment code này
    //@PreAuthorize("hasRole('ROLE_ADMIN')")
    //@GetMapping("/all")
    //public ResponseEntity<List<ServicePackageDTO>> getAllServicePackages() {
    //    List<ServicePackageDTO> packages = servicePackageService.getAll();
    //    return ResponseEntity.ok(packages);
    //}
}