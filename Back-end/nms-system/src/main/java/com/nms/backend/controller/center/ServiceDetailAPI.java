package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServiceDetailDTO;
import com.nms.backend.service.center.ServiceDetailService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/service-details")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class ServiceDetailAPI {

    private final ServiceDetailService serviceDetailService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ServiceDetailDTO create(@RequestBody ServiceDetailDTO dto) {
        return serviceDetailService.createServiceDetail(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ServiceDetailDTO update(@PathVariable Long id, @RequestBody ServiceDetailDTO dto) {
        return serviceDetailService.updateServiceDetail(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public void softDelete(@PathVariable Long id) {
        serviceDetailService.softDeleteServiceDetail(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER','GUEST')")
    public ServiceDetailDTO getById(@PathVariable Long id) {
        return serviceDetailService.getServiceDetailById(id);
    }

    @GetMapping("/package/{packageId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER','GUEST')")
    public List<ServiceDetailDTO> getByPackage(@PathVariable Long packageId) {
        return serviceDetailService.getServiceDetailsByPackage(packageId);
    }

    @GetMapping("/service-type/{serviceTypeId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER','GUEST')")
    public List<ServiceDetailDTO> getByServiceType(@PathVariable Long serviceTypeId) {
        return serviceDetailService.getServiceDetailsByServiceType(serviceTypeId);
    }

    @GetMapping("/search/name")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER','GUEST')")
    public List<ServiceDetailDTO> getByName(@RequestParam String name) {
        return serviceDetailService.getServiceDetailsByName(name);
    }

    @GetMapping("/search/duration")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF','MEMBER','GUEST')")
    public List<ServiceDetailDTO> getByDuration(@RequestParam Integer durationMinutes) {
        return serviceDetailService.getServiceDetailsByDuration(durationMinutes);
    }
}
