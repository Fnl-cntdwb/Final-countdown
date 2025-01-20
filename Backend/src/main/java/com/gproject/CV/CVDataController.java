package com.gproject.CV;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cv-data")
public class CVDataController {

    @Autowired
    private CVDataService cvDataService;

    @PostMapping
    public ResponseEntity<CVData> createCV(@RequestBody CVData cvData) {
        CVData createdCV = cvDataService.createCV(cvData);
        return ResponseEntity.ok(createdCV);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CVData> getCVById(@PathVariable Integer id) {
        CVData cvData = cvDataService.getCVById(id);
        return cvData != null ? ResponseEntity.ok(cvData) : ResponseEntity.notFound().build();
    }

    @GetMapping("/username")
    public ResponseEntity<CVData> getCVByUsername(@RequestParam String username) {
        CVData cvData = cvDataService.getCVByUsername(username);
        return cvData != null ? ResponseEntity.ok(cvData) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCVById(@PathVariable Integer id) {
        cvDataService.deleteCVById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CVData> updateCV(@PathVariable Integer id, @RequestBody CVData updatedData) {
        CVData updatedCV = cvDataService.updateCV(id, updatedData);
        return updatedCV != null ? ResponseEntity.ok(updatedCV) : ResponseEntity.notFound().build();
    }
}
