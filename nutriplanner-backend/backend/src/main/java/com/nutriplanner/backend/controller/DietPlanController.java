package com.nutriplanner.backend.controller;

import com.nutriplanner.backend.model.DietPlan;
import com.nutriplanner.backend.model.Disease;
import com.nutriplanner.backend.service.DietPlanService;
import com.nutriplanner.backend.service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diet-plans")
public class DietPlanController {

    @Autowired
    private DietPlanService dietPlanService;

    @Autowired
    private DiseaseService diseaseService;

    @GetMapping
    public ResponseEntity<List<DietPlan>> getAllDietPlans() {
        return ResponseEntity.ok(dietPlanService.getAllDietPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DietPlan> getDietPlanById(@PathVariable Long id) {
        DietPlan plan = dietPlanService.getDietPlanById(id);
        if (plan != null) {
            return ResponseEntity.ok(plan);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createDietPlan(@RequestBody Map<String, Object> payload) {
        try {
            DietPlan dietPlan = new DietPlan();
            dietPlan.setName((String) payload.get("name"));

            // Handle calories
            if (payload.get("calories") != null) {
                dietPlan.setCalories(Integer.parseInt(payload.get("calories").toString()));
            }

            // Handle diseaseId
            if (payload.get("diseaseId") != null && !payload.get("diseaseId").toString().isEmpty()) {
                Long diseaseId = Long.parseLong(payload.get("diseaseId").toString());
                Disease disease = diseaseService.getDiseaseById(diseaseId);
                if (disease != null) {
                    dietPlan.setDisease(disease);
                }
            }

            DietPlan created = dietPlanService.createDietPlan(dietPlan);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при создании: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDietPlan(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            DietPlan existing = dietPlanService.getDietPlanById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            existing.setName((String) payload.get("name"));

            // Handle calories
            if (payload.get("calories") != null) {
                existing.setCalories(Integer.parseInt(payload.get("calories").toString()));
            }

            // Handle diseaseId
            if (payload.get("diseaseId") != null && !payload.get("diseaseId").toString().isEmpty()) {
                Long diseaseId = Long.parseLong(payload.get("diseaseId").toString());
                Disease disease = diseaseService.getDiseaseById(diseaseId);
                existing.setDisease(disease);
            } else {
                existing.setDisease(null);
            }

            DietPlan updated = dietPlanService.updateDietPlan(id, existing);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при обновлении: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDietPlan(@PathVariable Long id) {
        try {
            dietPlanService.deleteDietPlan(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Рацион удалён");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при удалении: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}