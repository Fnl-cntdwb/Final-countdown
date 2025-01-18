package com.gproject.SoftSkill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SoftSkillService {

    @Autowired
    private SoftSkillRepository softSkillRepository;

    public SoftSkill createSoftSkill(SoftSkill softSkill) {
        return softSkillRepository.save(softSkill);
    }

    public List<SoftSkill> getSoftSkillsByCvId(Integer cvId) {
        return softSkillRepository.findByCvDataCvId(cvId);
    }

    public List<SoftSkill> getAllSoftSkills() {
        return softSkillRepository.findAll();
    }

    public void deleteSoftSkillById(Integer softSkillId) {
        softSkillRepository.deleteById(softSkillId);
    }
}