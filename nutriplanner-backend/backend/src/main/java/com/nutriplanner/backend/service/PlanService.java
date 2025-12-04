package com.nutriplanner.backend.service;

import com.nutriplanner.backend.model.DietPlan;
import com.nutriplanner.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;

    public List<DietPlan> getAllPlans() {
        return planRepository.findAll();
    }

    public DietPlan createPlan(DietPlan plan) {
        return planRepository.save(plan);
    }

    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
