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
public class ServicePackageAPI {

    @Autowired
    private ServicePackageService packageService;

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PostMapping
    public ServicePackageDTO createPackage(@RequestBody ServicePackageDTO dto) {
        return packageService.create(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @PutMapping("/{id}")
    public ServicePackageDTO updatePackage(@PathVariable Long id, @RequestBody ServicePackageDTO dto) {
        return packageService.update(id, dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    @DeleteMapping("/{id}")
    public void deletePackage(@PathVariable Long id) {
        packageService.delete(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping("/{id}")
    public ServicePackageDTO getPackageById(@PathVariable Long id) {
        return packageService.getById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping("/center/{centerId}")
    public List<ServicePackageDTO> getByCenter(@PathVariable Long centerId) {
        return packageService.getByCenter(centerId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping("/service-type/{serviceTypeId}")
    public List<ServicePackageDTO> getByServiceType(@PathVariable Long serviceTypeId) {
        return packageService.getByServiceType(serviceTypeId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER')")
    @GetMapping("/price-range")
    public List<ServicePackageDTO> getByPriceRange(@RequestParam Double min, @RequestParam Double max) {
        return packageService.getByPriceRange(min, max);
    }
}
