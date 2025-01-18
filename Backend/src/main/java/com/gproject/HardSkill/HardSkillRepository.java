package com.gproject.HardSkill;

import com.gproject.HardSkill.HardSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HardSkillRepository extends JpaRepository<HardSkill, Integer> {
    List<HardSkill> findByCvDataCvId(Integer cvId);
}