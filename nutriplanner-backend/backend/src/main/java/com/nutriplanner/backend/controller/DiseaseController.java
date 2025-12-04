package com.nutriplanner.backend.controller;

import com.nutriplanner.backend.model.Disease;
import com.nutriplanner.backend.service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diseases")
public class DiseaseController {

    @Autowired
    private DiseaseService diseaseService;

    @GetMapping
    public ResponseEntity<List<Disease>> getAllDiseases() {
        return ResponseEntity.ok(diseaseService.getAllDiseases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disease> getDiseaseById(@PathVariable Long id) {
        Disease disease = diseaseService.getDiseaseById(id);
        if (disease != null) {
            return ResponseEntity.ok(disease);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createDisease(@RequestBody Disease disease) {
        try {
            Disease created = diseaseService.createDisease(disease);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при создании: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDisease(@PathVariable Long id, @RequestBody Disease disease) {
        try {
            Disease updated = diseaseService.updateDisease(id, disease);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при обновлении: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDisease(@PathVariable Long id) {
        try {
            diseaseService.deleteDisease(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Заболевание удалено");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при удалении: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}