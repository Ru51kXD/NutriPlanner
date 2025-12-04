package com.nutriplanner.backend;

import com.nutriplanner.backend.model.User;
import com.nutriplanner.backend.model.DietPlan;
import com.nutriplanner.backend.model.Disease;
import com.nutriplanner.backend.repository.UserRepository;
import com.nutriplanner.backend.repository.PlanRepository;
import com.nutriplanner.backend.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private DiseaseRepository diseaseRepository;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Тестовые пользователи
//        if (userRepository.count() == 0) {
//            User user1 = new User();
//            user1.setName("Каролина Миллер");
//            user1.setEmail("miller@mail.ru");
//
//            User user2 = new User();
//            user2.setName("Дмитрий Тумаев");
//            user2.setEmail("tumaev@mail.ru");
//
//            userRepository.save(user1);
//            userRepository.save(user2);
//            System.out.println("✅ Тестовые пользователи созданы!");
//        }
//
//        // Тестовые планы
//        if (planRepository.count() == 0) {
//            DietPlan plan1 = new DietPlan();
//            plan1.setName("План при гастрите");
//            plan1.setDisease("gastritis");
//            plan1.setDuration("week");
//            plan1.setTotalCalories(2400);
//            plan1.setProtein(90);
//            plan1.setFat(70);
//            plan1.setCarbs(350);
//            plan1.setRecommendations("Щадящее питание");
//            plan1.setVitamins("A, E, B2, B6");
//
//            planRepository.save(plan1);
//            System.out.println("✅ Тестовые планы созданы!");
//        }
//
//        // Тестовые заболевания
//        if (diseaseRepository.count() == 0) {
//            Disease disease1 = new Disease();
//            disease1.setName("Гастрит");
//            disease1.setDescription("Воспаление желудка");
//            disease1.setCalories(2400);
//            disease1.setVitamins("A, E, B2, B6");
//            disease1.setProtein(90);
//            disease1.setFat(70);
//            disease1.setCarbs(350);
//
//            diseaseRepository.save(disease1);
//            System.out.println("✅ Тестовые заболевания созданы!");
//        }

        System.out.println("🚀 Сервер запущен: http://localhost:8080");
        System.out.println("👥 API Users: http://localhost:8080/api/users");
        System.out.println("📋 API Plans: http://localhost:8080/api/plans");
        System.out.println("🏥 API Diseases: http://localhost:8080/api/diseases");
    }
}










