package com.nutriplanner.backend.service;

import com.nutriplanner.backend.model.DietPlan;
import com.nutriplanner.backend.repository.DietPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DietPlanService {

    @Autowired
    private DietPlanRepository dietPlanRepository;

    public List<DietPlan> getAllDietPlans() {
        return dietPlanRepository.findAll();
    }

    public DietPlan getDietPlanById(Long id) {
        return dietPlanRepository.findById(id).orElse(null);
    }

    public DietPlan createDietPlan(DietPlan dietPlan) {
        return dietPlanRepository.save(dietPlan);
    }

    public DietPlan updateDietPlan(Long id, DietPlan dietPlanDetails) {
        return dietPlanRepository.save(dietPlanDetails);
    }

    public void deleteDietPlan(Long id) {
        dietPlanRepository.deleteById(id);
    }
}