package com.gproject.React;

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

            // Run npm build to generate production build
            ProcessBuilder buildProcessBuilder = new ProcessBuilder()
                    .command("npm.cmd", "run", "build")
                    .directory(reactProjectDir)
                    .inheritIO();

            Process buildProcess = buildProcessBuilder.start();
            int buildExitCode = buildProcess.waitFor();

            if (buildExitCode != 0) {
                logger.error("React build failed. Please check your npm configuration.");
                return;
            }

            File buildDir = new File(reactProjectDir, "build");
            File staticDir = new File(currentDir, "/src/main/resources/static");

            if (!staticDir.exists()) {
                if (!staticDir.mkdirs()) {
                    logger.error("Failed to create static directory.");
                    return;
                }
            }

            copyDirectory(buildDir, staticDir);
            logger.info("React app built and copied to static resources folder successfully.");
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to build and serve React app.", e);
        }
    }

    private void copyDirectory(File source, File destination) throws IOException {
        if (source.isDirectory()) {
            if (!destination.exists()) {
                destination.mkdirs();
            }
            String[] files = source.list();
            if (files != null) {
                for (String file : files) {
                    copyDirectory(new File(source, file), new File(destination, file));
                }
            }
        } else {
            java.nio.file.Files.copy(
                    source.toPath(),
                    destination.toPath(),
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING
            );
        }
    }
}
