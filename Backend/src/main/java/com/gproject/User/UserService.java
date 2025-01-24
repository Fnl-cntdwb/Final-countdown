package com.gproject.User;

import com.gproject.CV.CVData;
import com.gproject.CV.CVDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CVDataService cvDataService;

    public User createUser(User user) {
        user = userRepository.save(user);
        CVData cvData = new CVData();
        cvData.setUser(user);
        cvData.setCanvasData("");
        cvData = cvDataService.createCV(cvData);
        user.setCv(cvData);
        user = userRepository.save(user);
        user.setPassword(null);
        return user;
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

    public User setUserByUserId(Integer userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.setUsername(updatedUser.getUsername());
                    existingUser.setPassword(updatedUser.getPassword());
                    existingUser.setCv(updatedUser.getCv());
                    // Add other fields if necessary
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }
}