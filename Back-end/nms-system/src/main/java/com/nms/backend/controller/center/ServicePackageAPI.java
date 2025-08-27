package com.nms.backend.controller.center;

import com.nms.backend.dto.center.ServicePackageDTO;
import com.nms.backend.service.center.ServicePackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-packages")
@RequiredArgsConstructor
public class ServicePackageAPI {

    private final ServicePackageService service;

    @PostMapping
    public ServicePackageDTO create(@RequestBody ServicePackageDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ServicePackageDTO update(@PathVariable Long id, @RequestBody ServicePackageDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void softDelete(@PathVariable Long id) {
        service.softDelete(id);
    }

    @GetMapping
    public List<ServicePackageDTO> getAllActive() {
        return service.getAllActive();
    }

    @GetMapping("/{id}")
    public ServicePackageDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }
}
