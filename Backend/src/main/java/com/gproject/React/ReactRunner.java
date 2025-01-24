package com.gproject.React;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

@Component
public class ReactRunner implements CommandLineRunner, DisposableBean {

    private static final Log logger = LogFactory.getLog(ReactRunner.class);
    private static final int REACT_PORT = 3000; // Change to the port your React app uses
    private Process reactProcess;

    @Override
    public void run(String... args) {
        try {
            File currentDir = new File(System.getProperty("user.dir"));
            File reactProjectDir = new File(currentDir.getParent(), "/Frontend");

            // Run npm install
            ProcessBuilder installProcessBuilder = new ProcessBuilder()
                    .command("npm.cmd", "install")
                    .directory(reactProjectDir)
                    .inheritIO();
            Process installProcess = installProcessBuilder.start();
            int installExitCode = installProcess.waitFor();

            if (installExitCode != 0) {
                logger.error("npm install failed. Please check your npm configuration.");
                return;
            }

            // Start React application
            ProcessBuilder startProcessBuilder = new ProcessBuilder()
                    .command("npm.cmd", "start")
                    .directory(reactProjectDir)
                    .inheritIO();
            reactProcess = startProcessBuilder.start();

            logger.info("React application started on port " + REACT_PORT + ". Press Ctrl+C or stop the Spring application to terminate.");

        } catch (IOException | InterruptedException e) {
            logger.error("Failed to start React app", e);
        }
    }

    @Override
    public void destroy() {
        logger.info("Shutting down React application...");
        terminateProcessOnPort(REACT_PORT);
        if (reactProcess != null && reactProcess.isAlive()) {
            reactProcess.destroy();
            try {
                if (!reactProcess.waitFor(5, TimeUnit.SECONDS)) {
                    reactProcess.destroyForcibly();
                }
            } catch (InterruptedException e) {
                logger.error("Error while waiting for React process to terminate", e);
                Thread.currentThread().interrupt();
            }
        }
        logger.info("React application terminated.");
    }

    private void terminateProcessOnPort(int port) {
        try {
            String command;
            if (System.getProperty("os.name").toLowerCase().contains("win")) {
                // Windows: Find process using the port
                command = "cmd.exe /c netstat -ano | findstr :" + port;
            } else {
                // Unix-like: Find process using the port
                command = "bash -c \"lsof -i :" + port + " -t\"";
            }

            Process findProcess = new ProcessBuilder(command.split(" ")).start();
            try (Scanner scanner = new Scanner(findProcess.getInputStream())) {
                if (scanner.hasNextLine()) {
                    String line = scanner.nextLine().trim();
                    String pid;

                    if (System.getProperty("os.name").toLowerCase().contains("win")) {
                        // Extract PID from netstat output
                        String[] tokens = line.split("\\s+");
                        pid = tokens[tokens.length - 1]; // PID is the last token
                    } else {
                        // On Unix-like systems, lsof outputs the PID directly
                        pid = line;
                    }

                    logger.info("Found process using port " + port + " with PID: " + pid);

                    // Kill the process by PID
                    if (System.getProperty("os.name").toLowerCase().contains("win")) {
                        command = "cmd.exe /c taskkill /F /PID " + pid;
                    } else {
                        command = "bash -c \"kill -9 " + pid + "\"";
                    }

                    Process killProcess = new ProcessBuilder(command.split(" ")).start();
                    killProcess.waitFor();
                    logger.info("Terminated process with PID: " + pid + " on port: " + port);
                } else {
                    logger.warn("No process found using port " + port);
                }
            }
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to terminate process on port " + port, e);
            Thread.currentThread().interrupt();
        }
    }

}


