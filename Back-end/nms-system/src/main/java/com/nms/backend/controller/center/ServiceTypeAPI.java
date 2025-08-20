package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServiceTypeDTO;
import com.nms.backend.service.center.ServiceTypeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-types")
@SecurityRequirement(name = "api")
public class ServiceTypeAPI {

    @Autowired
    private ServiceTypeService serviceTypeService;

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping
    public ServiceTypeDTO create(@RequestBody ServiceTypeDTO dto) {
        return serviceTypeService.create(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PutMapping("/{id}")
    public ServiceTypeDTO update(@PathVariable Long id, @RequestBody ServiceTypeDTO dto) {
        return serviceTypeService.update(id, dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        serviceTypeService.delete(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @GetMapping("/{id}")
    public ServiceTypeDTO getById(@PathVariable Long id) {
        return serviceTypeService.getById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    @GetMapping("/center/{centerId}")
    public List<ServiceTypeDTO> getAllByCenter(@PathVariable Long centerId) {
        return serviceTypeService.getAllByCenter(centerId);
    }
}
