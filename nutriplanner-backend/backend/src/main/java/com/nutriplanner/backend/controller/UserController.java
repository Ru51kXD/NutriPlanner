package com.nutriplanner.backend.controller;

import com.nutriplanner.backend.model.User;
import com.nutriplanner.backend.service.UserService;
import com.nutriplanner.backend.dto.LoginRequest;
import com.nutriplanner.backend.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ НОВЫЙ МЕТОД - Создание пользователя из админки
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Проверяем, существует ли пользователь
            if (userService.findByEmail(user.getEmail()) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Пользователь с таким email уже существует");
                return ResponseEntity.badRequest().body(error);
            }

            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при создании: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ✅ НОВЫЙ МЕТОД - Обновление пользователя
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при обновлении: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Проверяем, существует ли пользователь
            if (userService.findByEmail(request.getEmail()) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Пользователь с таким email уже существует");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userService.registerUser(request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Регистрация успешна");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при регистрации: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());

            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Вход выполнен успешно");
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Неверный email или пароль");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при входе: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Пользователь удален");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Ошибка при удалении: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}