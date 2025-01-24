package com.gproject.React;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {

    @RequestMapping(value = "/") // Matches everything except static file requests
    public String forwardToReact() {
        return "forward:/index.html";
    }
}

