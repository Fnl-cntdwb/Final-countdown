package com.gproject.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        user.setPassword(user.getPassword());
        return userRepository.save(user);
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        user.setPassword(null);
        return user;
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}