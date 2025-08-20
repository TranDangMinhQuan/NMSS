package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServicePackageDTO;
import com.nms.backend.service.center.ServicePackageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@SecurityRequirement(name = "api")
public class ServicePackageAPI{

    @Autowired
    private ServicePackageService packageService;

    // Tạo gói dịch vụ (ADMIN/STAFF)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PostMapping
    public ServicePackageDTO createPackage(@RequestBody ServicePackageDTO dto) {
        return packageService.create(dto);
    }

    // Cập nhật gói dịch vụ (ADMIN/STAFF)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PutMapping("/{id}")
    public ServicePackageDTO updatePackage(@PathVariable Long id, @RequestBody ServicePackageDTO dto) {
        return packageService.update(id, dto);
    }

    // Xóa gói dịch vụ (soft delete) (ADMIN/STAFF)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        packageService.delete(id);
    }

    // Lấy thông tin gói dịch vụ theo ID (Admin/Staff/Member)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping("/{id}")
    public ServicePackageDTO getPackageById(@PathVariable Long id) {
        return packageService.getById(id);
    }

    // Lấy danh sách tất cả gói dịch vụ (Admin/Staff/Member)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping
    public List<ServicePackageDTO> getAllPackages() {
        return packageService.getAll();
    }
}
