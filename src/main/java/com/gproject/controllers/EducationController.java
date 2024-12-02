package com.gproject.controllers;

import com.gproject.entities.Education;
import com.gproject.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/education")
public class EducationController {

    @Autowired
    private EducationService educationService;

    @PostMapping
    public ResponseEntity<Education> createEducation(@RequestBody Education education) {
        return ResponseEntity.ok(educationService.createEducation(education));
    }

    @GetMapping("/cv/{cvId}")
    public ResponseEntity<List<Education>> getEducationByCvId(@PathVariable Integer cvId) {
        return ResponseEntity.ok(educationService.getEducationByCvId(cvId));
    }

    @GetMapping
    public ResponseEntity<List<Education>> getAllEducation() {
        return ResponseEntity.ok(educationService.getAllEducation());
    }

    @DeleteMapping("/{educationId}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Integer educationId) {
        educationService.deleteEducationById(educationId);
        return ResponseEntity.noContent().build();
    }
}