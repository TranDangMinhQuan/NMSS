package com.nms.backend.service.center;

import com.nms.backend.dto.center.CenterDTO;
import java.util.List;

public interface CenterService {
    CenterDTO create(CenterDTO dto);
    CenterDTO update(Long id, CenterDTO dto);
    void delete(Long id);
    CenterDTO getById(Long id);

    List<CenterDTO> getByName(String name);
    List<CenterDTO> getByPhone(String phone);
    List<CenterDTO> getByAddress(String address);
}
