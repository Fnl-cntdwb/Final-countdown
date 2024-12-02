package com.gproject.services;

import com.gproject.entities.Education;
import com.gproject.repositories.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationService {

    @Autowired
    private EducationRepository educationRepository;

    public Education createEducation(Education education) {
        return educationRepository.save(education);
    }

    public List<Education> getEducationByCvId(Integer cvId) {
        return educationRepository.findByCvDataCvId(cvId);
    }

    public List<Education> getAllEducation() {
        return educationRepository.findAll();
    }

    public void deleteEducationById(Integer educationId) {
        educationRepository.deleteById(educationId);
    }
}