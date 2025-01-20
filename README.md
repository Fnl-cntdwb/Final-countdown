# Building the Backend and Installing Dependencies

To compile the application and run it without using an IDE, maven must be installed and correctly added to your environment variable.

To install and add maven to environment variable visit [(https://mkyong.com/maven/how-to-install-maven-in-windows/)]

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
