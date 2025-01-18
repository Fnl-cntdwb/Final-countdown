package com.gproject.CV;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CVData>> getCVsByUserId(@PathVariable Integer userId) {
        List<CVData> cvDataList = cvDataService.getCVsByUserId(userId);
        return ResponseEntity.ok(cvDataList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCVById(@PathVariable Integer id) {
        cvDataService.deleteCVById(id);
        return ResponseEntity.noContent().build();
    }
}