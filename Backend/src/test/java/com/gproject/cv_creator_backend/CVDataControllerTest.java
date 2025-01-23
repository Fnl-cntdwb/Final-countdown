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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CVDataController.class)
public class CVDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CVDataService cvDataService;

    @Test
    void testCreateCV() throws Exception {
        CVData mockCV = new CVData();
        mockCV.setCvId(1);
        mockCV.setCanvasData("Sample Data");
        mockCV.setUser(new User());

        Mockito.when(cvDataService.createCV(any(CVData.class))).thenReturn(mockCV);

        mockMvc.perform(post("/cv-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"canvasData\":\"Sample Data\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.canvasData").value("Sample Data"));
    }

    @Test
    void testGetCVById() throws Exception {
        CVData mockCV = new CVData();
        mockCV.setCvId(1);
        mockCV.setCanvasData("Sample Data");

        Mockito.when(cvDataService.getCVById(1)).thenReturn(mockCV);

        mockMvc.perform(get("/cv-data/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cvId").value(1))
                .andExpect(jsonPath("$.canvasData").value("Sample Data"));
    }
}
