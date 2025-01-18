package com.gproject.BaseComponent;

import com.gproject.CV.CVData;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "component_type", discriminatorType = DiscriminatorType.STRING)
public abstract class BaseComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int positionX; // X-coordinate on the canvas
    private int positionY; // Y-coordinate on the canvas

    @ManyToOne
    @JoinColumn(name = "cv_id", nullable = false)
    private CVData cv;

    // Getters and Setters
}
