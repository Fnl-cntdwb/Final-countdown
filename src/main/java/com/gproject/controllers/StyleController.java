package com.gproject.controllers;

import com.gproject.entities.Style;
import com.gproject.services.StyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/styles")
public class StyleController {
    @Autowired
    private StyleService styleService;

    @PostMapping
    public ResponseEntity<Style> createStyle(@RequestBody Style style) {
        Style createdStyle = styleService.createStyle(style);
        return ResponseEntity.ok(createdStyle);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Style> getStyleById(@PathVariable Integer id) {
        Style style = styleService.getStyleById(id);
        return style != null ? ResponseEntity.ok(style) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Style>> getAllStyles() {
        List<Style> styles = styleService.getAllStyles();
        return ResponseEntity.ok(styles);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStyleById(@PathVariable Integer id) {
        styleService.deleteStyleById(id);
        return ResponseEntity.noContent().build();
    }
}