package com.gproject.CV;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public CVData getCVByUsername(String username) {
        return cvDataRepository.findByUserUsername(username);
    }

    public void deleteCVById(Integer cvId) {
        cvDataRepository.deleteById(cvId);
    }

    public CVData updateCV(Integer cvId, CVData updatedData) {
        return cvDataRepository.findById(cvId)
                .map(cv -> {
                    cv.setCanvasData(updatedData.getCanvasData());
                    return cvDataRepository.save(cv);
                })
                .orElse(null);
    }
}


