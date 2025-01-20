package com.gproject.CV;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CVDataRepository extends JpaRepository<CVData, Integer> {
    CVData findByUserUsername(String username);
}