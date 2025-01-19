package com.gproject.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "soft_skill")
public class SoftSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "soft_skill_id")
    private Integer softSkillId;

    @Column(name = "soft_skill_name", nullable = false, length = 30)
    private String softSkillName;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CVData cvData;

    // Getters and Setters
    public Integer getSoftSkillId() {
        return softSkillId;
    }

    public void setSoftSkillId(Integer softSkillId) {
        this.softSkillId = softSkillId;
    }

    public String getSoftSkillName() {
        return softSkillName;
    }

    public void setSoftSkillName(String softSkillName) {
        this.softSkillName = softSkillName;
    }

    public CVData getCvData() {
        return cvData;
    }

    public void setCvData(CVData cvData) {
        this.cvData = cvData;
    }
}