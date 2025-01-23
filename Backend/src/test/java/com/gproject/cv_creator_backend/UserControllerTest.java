package com.gproject.cv_creator_backend;

import com.gproject.User.User;
import com.gproject.User.UserController;
import com.gproject.User.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testRegisterUser() throws Exception {
        User mockUser = new User();

        Mockito.when(userService.createUser(any(User.class))).thenReturn(mockUser);

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testuser\", \"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.password").value(1));
    }

    @Test
    void testLogin() throws Exception {
        User mockUser = new User();
        mockUser.setUsername("testuser");
        mockUser.setPassword("password123");

        Mockito.when(userService.authenticate("testuser", "password123")).thenReturn(mockUser);

         mockMvc.perform(post("/user/login")
                        .param("username", "testuser")
                        .param("password", "password123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }
}

