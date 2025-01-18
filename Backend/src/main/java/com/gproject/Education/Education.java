package com.gproject.Education;

import com.gproject.CV.CVData;
import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "education_id")
    private Integer educationId;

    @Column(name = "start_year", nullable = false)
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "educ_place_title", nullable = false, length = 50)
    private String educPlaceTitle;

    @Column(name = "educ_place_desc", length = 200)
    private String educPlaceDesc;

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CVData cvData;

    public Integer getEducationId() {
        return educationId;
    }

    public void setEducationId(Integer educationId) {
        this.educationId = educationId;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    public Integer getEndYear() {
        return endYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public String getEducPlaceTitle() {
        return educPlaceTitle;
    }

    public void setEducPlaceTitle(String educPlaceTitle) {
        this.educPlaceTitle = educPlaceTitle;
    }

    public String getEducPlaceDesc() {
        return educPlaceDesc;
    }

    public void setEducPlaceDesc(String educPlaceDesc) {
        this.educPlaceDesc = educPlaceDesc;
    }

    public CVData getCvData() {
        return cvData;
    }

    public void setCvData(CVData cvData) {
        this.cvData = cvData;
    }
}