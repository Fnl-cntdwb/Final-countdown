package com.gproject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class ReactRunner implements CommandLineRunner {

    private static final Log logger = LogFactory.getLog(ReactRunner.class);

    @Override
    public void run(String... args) {
        try {
            File currentDir = new File(System.getProperty("user.dir"));
            File reactProjectDir = new File(currentDir.getParent(), "/Frontend");

            // Ensure Node.js dependencies are installed
            ProcessBuilder npmInstallBuilder = new ProcessBuilder()
                    .command("npm", "install")
                    .directory(reactProjectDir)
                    .inheritIO();

            Process npmInstallProcess = npmInstallBuilder.start();
            int installExitCode = npmInstallProcess.waitFor();

            if (installExitCode == 0) {
                logger.info("Node.js dependencies installed successfully.");
            } else {
                logger.error("Failed to install Node.js dependencies. Please check your package.json file.");
                return;
            }

            // Start the React development server
            ProcessBuilder npmStartBuilder = new ProcessBuilder()
                    .command("npm", "start")
                    .directory(reactProjectDir)
                    .inheritIO();

            npmStartBuilder.start();
            logger.info("React development server started successfully in directory: " + reactProjectDir.getAbsolutePath());
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to start React development server. Please ensure Node.js and npm are correctly installed.", e);
        }
    }
}
