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
import com.gproject.CV.CVDataRepository;
import com.gproject.CV.CVDataService;
import com.gproject.CV.CVData;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class CVDataServiceTest {

    @Autowired
    private CVDataService cvDataService;

    @MockBean
    private CVDataRepository cvDataRepository;

    @Test
    public void testUpdateCV() {
        CVData cv1 = new CVData();
        cv1.setCvId(5);
        cv1.setCanvasData("Text to be removed");

        CVData cv2 = new CVData();
        cv2.setCanvasData("Updated text");

        when(cvDataRepository.findById(5)).thenReturn(Optional.of(cv1));
        when(cvDataRepository.save(any(CVData.class))).thenReturn(cv1);

        CVData cv3 = cvDataService.updateCV(5, cv2);

        verify(cvDataRepository).save(cv1);

        assertEquals("Updated text", cv3.getCanvasData());
    }

    @Test
    public void testGetCVByUsername() {
        User mockUser = new User();
        mockUser.setUsername("yasser");

        CVData cv = new CVData();
        cv.setCanvasData("test");
        cv.setUser(mockUser);

        when(cvDataRepository.findByUserUsername(cv.getUser().getUsername())).thenReturn(cv);

        CVData resultCV = cvDataService.getCVByUsername("yasser");

        assertEquals("test", resultCV.getCanvasData());
    }
}