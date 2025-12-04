package com.nutriplanner.backend.repository;

import com.nutriplanner.backend.model.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<DietPlan, Long> {
}