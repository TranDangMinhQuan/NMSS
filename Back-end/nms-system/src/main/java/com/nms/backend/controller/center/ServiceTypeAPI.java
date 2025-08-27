package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServiceTypeDTO;
import com.nms.backend.service.center.ServiceTypeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-types")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class ServiceTypeAPI {

    private final ServiceTypeService serviceTypeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ServiceTypeDTO create(@RequestBody ServiceTypeDTO dto) {
        return serviceTypeService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ServiceTypeDTO update(@PathVariable Long id, @RequestBody ServiceTypeDTO dto) {
        return serviceTypeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        serviceTypeService.delete(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ServiceTypeDTO getById(@PathVariable Long id) {
        return serviceTypeService.getById(id);
    }

    @GetMapping("/center/{centerId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<ServiceTypeDTO> getByCenter(@PathVariable Long centerId) {
        return serviceTypeService.getByCenter(centerId);
    }

}
