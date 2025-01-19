package com.gproject.services;

import com.gproject.entities.Style;
import com.gproject.repositories.StyleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StyleService {
    @Autowired
    private StyleRepository styleRepository;

    public Style createStyle(Style style) {
        return styleRepository.save(style);
    }

    public Style getStyleById(Integer styleId) {
        return styleRepository.findById(styleId).orElse(null);
    }

    public List<Style> getAllStyles() {
        return styleRepository.findAll();
    }

    public void deleteStyleById(Integer styleId) {
        styleRepository.deleteById(styleId);
    }
}