package com.gproject.services;

import com.gproject.entities.HardSkill;
import com.gproject.repositories.HardSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HardSkillService {

    @Autowired
    private HardSkillRepository hardSkillRepository;

    public HardSkill createHardSkill(HardSkill hardSkill) {
        return hardSkillRepository.save(hardSkill);
    }

    public List<HardSkill> getHardSkillsByCvId(Integer cvId) {
        return hardSkillRepository.findByCvDataCvId(cvId);
    }

    public List<HardSkill> getAllHardSkills() {
        return hardSkillRepository.findAll();
    }

    public void deleteHardSkillById(Integer hardSkillId) {
        hardSkillRepository.deleteById(hardSkillId);
    }
}