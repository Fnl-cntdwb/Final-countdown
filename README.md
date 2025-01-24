# Building the Backend and Installing Dependencies

To compile the application and run it without using an IDE, maven must be installed and correctly added to your environment variable.

To install and add maven to environment variable visit [(https://mkyong.com/maven/how-to-install-maven-in-windows/)].

Navigate to the root of the project and then - to the "Backend" folder via command line, and execute the command

### mvn spring-boot:run

## Available in-IDE Scripts

In the project directory, you can run:

### `mvn dependency:resolve`

Resolves and downloads dependencies.

### `mvn clean install`

Builds project and installs dependencies.

### `mvn dependency:go-offline`

Pre-fetches dependencies for offline use.

### `mvn clean install -DskipTests`

Installs dependencies without running tests.

### `mvn dependency:tree`

Displays dependency tree


The version of Java to compile the project should be 17.
