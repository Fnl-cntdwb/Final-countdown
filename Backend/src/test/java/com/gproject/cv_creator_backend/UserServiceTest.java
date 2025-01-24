package com.gproject.cv_creator_backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.mockito.ArgumentMatchers.any;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.gproject.User.User;
import com.gproject.User.UserRepository;
import com.gproject.CV.CVDataService;
import com.gproject.User.UserService;
import com.gproject.CV.CVData;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private CVDataService cvDataService;

    @Test
    public void testCreateUser() {

        CVData cv = new CVData();
        cv.setCanvasData("");

        User mockUs = new User();
        mockUs.setUserId(2);
        mockUs.setUsername("yasser");
        mockUs.setPassword("test");

        when(cvDataService.createCV(any(CVData.class))).thenReturn(cv);
        when(userRepository.save(any(User.class))).thenReturn(mockUs);

        User newUser = userService.createUser(mockUs);
        CVData result = newUser.getCv();

        verify(userRepository, times(2)).save(mockUs);

        assertNotNull(result);
    }

    @Test
    public void testAuthenticate() {
        User mockUs = new User();
        mockUs.setUserId(2);
        mockUs.setUsername("yasser");
        mockUs.setPassword("test");

        when(userRepository.findByUsername("yasser")).thenReturn(Optional.of(mockUs));

        User result = userService.authenticate("yasser", "test");

        verify(userRepository).findByUsername("yasser");

        assertEquals(2, result.getUserId());
    }
}
