package com.gproject.repositories;

import com.gproject.entities.HardSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HardSkillRepository extends JpaRepository<HardSkill, Integer> {
    List<HardSkill> findByCvDataCvId(Integer cvId);
}