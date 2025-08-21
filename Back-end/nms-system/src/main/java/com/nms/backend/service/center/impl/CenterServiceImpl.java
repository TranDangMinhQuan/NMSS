package com.nms.backend.service.center.impl;

import com.nms.backend.dto.center.CenterDTO;
import com.nms.backend.entity.center.Center;
import com.nms.backend.repository.center.CenterRepository;
import com.nms.backend.service.center.CenterService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CenterServiceImpl implements CenterService {

    @Autowired
    private CenterRepository centerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CenterDTO create(CenterDTO dto) {
        Center center = modelMapper.map(dto, Center.class);
        center.setDeleted(false);
        Center saved = centerRepository.save(center);
        return modelMapper.map(saved, CenterDTO.class);
    }

    @Override
    public CenterDTO update(Long id, CenterDTO dto) {
        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Center not found"));

        center.setName(dto.getName());
        center.setAddress(dto.getAddress());
        center.setPhone(dto.getPhone());

        Center updated = centerRepository.save(center);
        return modelMapper.map(updated, CenterDTO.class);
    }

    @Override
    public void delete(Long id) {
        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Center not found"));

        center.setDeleted(true); // soft delete
        centerRepository.save(center);
    }

    @Override
    public CenterDTO getById(Long id) {
        Center center = centerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Center not found or deleted"));
        return modelMapper.map(center, CenterDTO.class);
    }


    @Override
    public List<CenterDTO> getByName(String name) {
        return centerRepository.findByNameAndDeletedFalse(name)
                .stream()
                .map(center -> modelMapper.map(center, CenterDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CenterDTO> getByPhone(String phone) {
        return centerRepository.findByPhoneAndDeletedFalse(phone)
                .stream()
                .map(center -> modelMapper.map(center, CenterDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CenterDTO> getByAddress(String address) {
        return centerRepository.findByAddressAndDeletedFalse(address)
                .stream()
                .map(center -> modelMapper.map(center, CenterDTO.class))
                .collect(Collectors.toList());
    }
}
