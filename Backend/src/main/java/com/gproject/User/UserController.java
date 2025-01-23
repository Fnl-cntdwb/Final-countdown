package com.gproject.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String username, @RequestParam String password) {
        User user = userService.authenticate(username, password);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestParam User user) {
        userService.deleteUser(user);
        return ResponseEntity.noContent().build();
    }
}