package com.nutriplanner.backend.service;

import com.nutriplanner.backend.model.Disease;
import com.nutriplanner.backend.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiseaseService {

    @Autowired
    private DiseaseRepository diseaseRepository;

    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    public Disease getDiseaseById(Long id) {
        return diseaseRepository.findById(id).orElse(null);
    }

    public Disease createDisease(Disease disease) {
        return diseaseRepository.save(disease);
    }

    public Disease updateDisease(Long id, Disease diseaseDetails) {
        Disease disease = diseaseRepository.findById(id).orElse(null);
        if (disease != null) {
            disease.setName(diseaseDetails.getName());
            disease.setDescription(diseaseDetails.getDescription());
            disease.setCalories(diseaseDetails.getCalories());
            disease.setVitamins(diseaseDetails.getVitamins());
            disease.setProtein(diseaseDetails.getProtein());
            disease.setFat(diseaseDetails.getFat());
            disease.setCarbs(diseaseDetails.getCarbs());
            return diseaseRepository.save(disease);
        }
        return null;
    }

    public void deleteDisease(Long id) {
        diseaseRepository.deleteById(id);
    }
}