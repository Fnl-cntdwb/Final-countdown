package com.gproject.HardSkill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hard-skills")
public class HardSkillController {

    @Autowired
    private HardSkillService hardSkillService;

    @PostMapping
    public ResponseEntity<HardSkill> createHardSkill(@RequestBody HardSkill hardSkill) {
        return ResponseEntity.ok(hardSkillService.createHardSkill(hardSkill));
    }

    @GetMapping("/cv/{cvId}")
    public ResponseEntity<List<HardSkill>> getHardSkillsByCvId(@PathVariable Integer cvId) {
        return ResponseEntity.ok(hardSkillService.getHardSkillsByCvId(cvId));
    }

    @GetMapping
    public ResponseEntity<List<HardSkill>> getAllHardSkills() {
        return ResponseEntity.ok(hardSkillService.getAllHardSkills());
    }

    @DeleteMapping("/{hardSkillId}")
    public ResponseEntity<Void> deleteHardSkill(@PathVariable Integer hardSkillId) {
        hardSkillService.deleteHardSkillById(hardSkillId);
        return ResponseEntity.noContent().build();
    }
}