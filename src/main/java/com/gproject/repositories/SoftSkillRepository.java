package com.gproject.repositories;

import com.gproject.entities.SoftSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoftSkillRepository extends JpaRepository<SoftSkill, Integer> {
    List<SoftSkill> findByCvDataCvId(Integer cvId);
}