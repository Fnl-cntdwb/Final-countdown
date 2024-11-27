package com.gproject.repositories;

import com.gproject.entities.CVData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CVDataRepository extends JpaRepository<CVData, Integer> {
    List<CVData> findByUserUserId(Integer userId);
}