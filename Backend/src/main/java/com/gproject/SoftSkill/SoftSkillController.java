package com.gproject.SoftSkill;

import com.gproject.SoftSkill.SoftSkill;
import com.gproject.SoftSkill.SoftSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/soft-skills")
public class SoftSkillController {

    @Autowired
    private SoftSkillService softSkillService;

    @PostMapping
    public ResponseEntity<SoftSkill> createSoftSkill(@RequestBody SoftSkill softSkill) {
        return ResponseEntity.ok(softSkillService.createSoftSkill(softSkill));
    }

    @GetMapping("/cv/{cvId}")
    public ResponseEntity<List<SoftSkill>> getSoftSkillsByCvId(@PathVariable Integer cvId) {
        return ResponseEntity.ok(softSkillService.getSoftSkillsByCvId(cvId));
    }

    @GetMapping
    public ResponseEntity<List<SoftSkill>> getAllSoftSkills() {
        return ResponseEntity.ok(softSkillService.getAllSoftSkills());
    }

    @DeleteMapping("/{softSkillId}")
    public ResponseEntity<Void> deleteSoftSkill(@PathVariable Integer softSkillId) {
        softSkillService.deleteSoftSkillById(softSkillId);
        return ResponseEntity.noContent().build();
    }
}