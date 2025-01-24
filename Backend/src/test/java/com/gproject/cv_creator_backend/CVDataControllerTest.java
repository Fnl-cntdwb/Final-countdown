package com.gproject.cv_creator_backend;

import com.gproject.CV.CVData;
import com.gproject.CV.CVDataController;
import com.gproject.CV.CVDataService;
import com.gproject.User.User;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CVDataController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CVDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CVDataService cvDataService;

    @Test
    void testCreateCV() throws Exception {
        CVData inputCV = new CVData();
        User user = new User();
        user.setUserId(1);
        user.setUsername("testuser");
        inputCV.setUser(user);
        inputCV.setCanvasData("Sample canvas data");

        CVData expectedCV = new CVData();
        expectedCV.setCvId(1);
        expectedCV.setUser(user);
        expectedCV.setCanvasData("Sample canvas data");

        Mockito.when(cvDataService.createCV(any(CVData.class))).thenReturn(expectedCV);

        mockMvc.perform(post("/cv-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {
                        "user": {
                            "userId": 1,
                            "username": "testuser"
                        },
                        "canvasData": "Sample canvas data"
                    }
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.user.userId").value(1))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.canvasData").value("Sample canvas data"));
    }

    @Test
    void testUpdateCV() throws Exception {
        CVData updatedCV = new CVData();
        updatedCV.setCvId(1);
        User user = new User();
        user.setUserId(1);
        user.setUsername("testuser");
        updatedCV.setUser(user);
        updatedCV.setCanvasData("Updated canvas data");

        Mockito.when(cvDataService.updateCV(eq(1), any(CVData.class))).thenReturn(updatedCV);

        mockMvc.perform(put("/cv-data/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {
                        "user": {
                            "userId": 1,
                            "username": "testuser"
                        },
                        "canvasData": "Updated canvas data"
                    }
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.user.userId").value(1))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.canvasData").value("Updated canvas data"));
    }

    @Test
    void testGetCVById() throws Exception {
        CVData cvData = new CVData();
        cvData.setCvId(1);
        User user = new User();
        user.setUserId(1);
        user.setUsername("testuser");
        cvData.setUser(user);
        cvData.setCanvasData("Sample canvas data");

        Mockito.when(cvDataService.getCVById(eq(1))).thenReturn(cvData);

        mockMvc.perform(get("/cv-data/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.user.userId").value(1))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.canvasData").value("Sample canvas data"));
    }

    @Test
    void testGetCVByUsername() throws Exception {
        CVData cvData = new CVData();
        cvData.setCvId(1);
        User user = new User();
        user.setUserId(1);
        user.setUsername("testuser");
        cvData.setUser(user);
        cvData.setCanvasData("Sample canvas data");

        Mockito.when(cvDataService.getCVByUsername(eq("testuser"))).thenReturn(cvData);

        mockMvc.perform(get("/cv-data/username")
                        .param("username", "testuser")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.user.userId").value(1))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.canvasData").value("Sample canvas data"));
    }
}
