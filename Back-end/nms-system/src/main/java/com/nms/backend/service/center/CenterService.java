package com.nms.backend.service.center;



import com.nms.backend.dto.center.CenterDTO;

import java.util.List;

public interface CenterService {
    CenterDTO create(CenterDTO dto);
    CenterDTO update(Long id, CenterDTO dto);
    void delete(Long id);
    List<CenterDTO> getAll();
    CenterDTO getById(Long id);
}
