package com.gproject.React;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReactController {

    @GetMapping("/")
    public String forwardToReact() {
        return "forward:/index.html";
    }
}

