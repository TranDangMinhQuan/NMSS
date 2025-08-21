package com.nms.backend.controller.center;

import com.nms.backend.dto.center.CenterDTO;
import com.nms.backend.service.center.CenterService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centers")
@SecurityRequirement(name = "api")
public class CenterAPI {

    @Autowired
    private CenterService centerService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CenterDTO create(@RequestBody CenterDTO dto) {
        return centerService.create(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public CenterDTO update(@PathVariable Long id, @RequestBody CenterDTO dto) {
        return centerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        centerService.delete(id);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public CenterDTO getById(@PathVariable Long id) {
        return centerService.getById(id);
    }

    @GetMapping("/search/by-name")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public List<CenterDTO> getByName(@RequestParam String name) {
        return centerService.getByName(name);
    }

    @GetMapping("/search/by-phone")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public List<CenterDTO> getByPhone(@RequestParam String phone) {
        return centerService.getByPhone(phone);
    }

    @GetMapping("/search/by-address")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MEMBER')")
    public List<CenterDTO> getByAddress(@RequestParam String address) {
        return centerService.getByAddress(address);
    }
}
