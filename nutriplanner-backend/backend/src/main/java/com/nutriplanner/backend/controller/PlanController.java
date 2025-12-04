package com.nutriplanner.backend.controller;

import com.nutriplanner.backend.model.DietPlan;
import com.nutriplanner.backend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
    @Autowired
    private PlanService planService;

    @GetMapping
    public List<DietPlan> getAllPlans() {
        return planService.getAllPlans();
    }

    @PostMapping
    public DietPlan createPlan(@RequestBody DietPlan plan) {
        return planService.createPlan(plan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
    }
}