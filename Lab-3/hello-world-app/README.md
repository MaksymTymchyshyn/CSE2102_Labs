# Hello World Maven Application

This is a simple Maven project that demonstrates a basic "Hello World" application in Java.

## Project Structure

```
hello-world-app
├── src
│   ├── main
│   │   └── java
│   │       └── com
│   │           └── example
│   │               └── App.java
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── AppTest.java
├── pom.xml
└── README.md
```

## How to Build and Run

1. **Install Maven**: Make sure you have Maven installed on your machine. You can download it from [Maven's official website](https://maven.apache.org/download.cgi).

2. **Clone the Repository**: If you haven't already, clone the repository to your local machine.

   ```bash
   git clone <repository-url>
   cd hello-world-app
   ```

3. **Build the Project**: Navigate to the project directory and run the following command to build the project:

   ```bash
   mvn clean install
   ```

4. **Run the Application**: After building the project, you can run the application using the following command:

   ```bash
   mvn exec:java -Dexec.mainClass="com.example.App"
   ```

## Running Tests

To run the tests included in this project, use the following command:

```bash
mvn test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.