package com.gproject.services;

import com.gproject.entities.CVData;
import com.gproject.repositories.CVDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CVDataService {

    @Autowired
    private CVDataRepository cvDataRepository;

    public CVData createCV(CVData cvData) {
        return cvDataRepository.save(cvData);
    }

    public CVData getCVById(Integer cvId) {
        return cvDataRepository.findById(cvId).orElse(null);
    }

    public List<CVData> getCVsByUserId(Integer userId) {
        return cvDataRepository.findByUserUserId(userId);
    }

    public void deleteCVById(Integer cvId) {
        cvDataRepository.deleteById(cvId);
    }
}