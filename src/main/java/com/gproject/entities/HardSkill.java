package com.gproject.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "hard_skill")
public class HardSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hard_skill_id")
    private Integer hardSkillId;

    @Column(name = "hard_skill_name", nullable = false, length = 30)
    private String hardSkillName;

    @Column(name = "hard_skill_eval")
    private Integer hardSkillEval;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CVData cvData;

    // Getters and Setters
    public Integer getHardSkillId() {
        return hardSkillId;
    }

    public void setHardSkillId(Integer hardSkillId) {
        this.hardSkillId = hardSkillId;
    }

    public String getHardSkillName() {
        return hardSkillName;
    }

    public void setHardSkillName(String hardSkillName) {
        this.hardSkillName = hardSkillName;
    }

    public Integer getHardSkillEval() {
        return hardSkillEval;
    }

    public void setHardSkillEval(Integer hardSkillEval) {
        this.hardSkillEval = hardSkillEval;
    }

    public CVData getCvData() {
        return cvData;
    }

    public void setCvData(CVData cvData) {
        this.cvData = cvData;
    }
}