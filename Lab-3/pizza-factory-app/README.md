# Hello World Maven Application

This is a simple Maven project that demonstrates a basic "Hello World" application in Java.

## Project Structure

# Lab 3: Pizza Factory Pattern with Maven

This project demonstrates the **Factory Design Pattern** implementation for a pizza ordering system, now built and managed using **Apache Maven**. This lab converts Lab 2's pizza factory system into a proper Maven project structure.

## Project Overview

This Maven-based application showcases:
- **Factory Design Pattern** implementation
- **Maven project structure** and build lifecycle
- **JUnit 4 testing** integration with Maven
- **Proper Java package structure** (`com.example`)
- **Maven dependency management**

## Maven Project Structure

```
Lab-3/pizza-factory-app/
├── pom.xml                           # Maven project configuration
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           └── example/          # Java package structure
│   │               ├── App.java              # Main application entry point
│   │               ├── Pizza.java            # Abstract base class
│   │               ├── PizzaFactory.java     # Factory for creating pizzas
│   │               ├── PizzaStore.java       # Store that uses the factory
│   │               ├── CheesePizza.java      # Concrete pizza implementation
│   │               ├── GlutenFreePizza.java  # Concrete pizza implementation
│   │               ├── GreekPizza.java       # Concrete pizza implementation
│   │               └── PeperoniPizza.java    # Concrete pizza implementation
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── AppTest.java          # JUnit 4 test cases
└── README.md                         # This file
```

## Design Pattern Implementation

The **Factory Pattern** consists of:

- **Pizza (Abstract Product)**: Defines the pizza interface with common operations
- **Concrete Products**: CheesePizza, GlutenFreePizza, GreekPizza, PeperoniPizza
- **PizzaFactory (Factory)**: Creates concrete pizza instances based on string type
- **PizzaStore (Client)**: Uses the factory to create and process orders
- **App (Main)**: Demonstrates the system in action

## Pizza Types Supported

1. **Cheese Pizza** - Classic cheese pizza
2. **Greek Pizza** - Traditional Greek-style pizza  
3. **Pepperoni Pizza** - Pizza with pepperoni toppings
4. **Gluten-Free Pizza** - Special dietary option

## Maven Commands

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Apache Maven 3.6 or higher

### Build and Test Commands

**Clean and compile the project:**
```bash
mvn clean compile
```

**Run all unit tests:**
```bash
mvn test
```

**Run the main application:**
```bash
mvn exec:java -Dexec.mainClass="com.example.App"
```

**Package the project (create JAR):**
```bash
mvn package
```

**Run the complete build lifecycle:**
```bash
mvn clean install
```

## Expected Outputs

### Main Application Output
```
Ordering a Cheese Pizza:
Cheese Pizza is being prepared.
Cheese Pizza is being baked.
Cheese Pizza is being cut.
Cheese Pizza is being boxed.

Ordering a Greek Pizza:
Greek Pizza is being prepared.
Greek Pizza is being baked.
Greek Pizza is being cut.
Greek Pizza is being boxed.

Ordering a Gluten-Free Pizza:
GlutenFree Pizza is being prepared.
GlutenFree Pizza is being baked.
GlutenFree Pizza is being cut.
GlutenFree Pizza is being boxed.
```

### Test Results Output
```
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## Maven Dependencies

The project uses the following dependencies (managed in `pom.xml`):

- **JUnit 4.13.2**: Testing framework for unit tests
- **Hamcrest Core 1.3**: Matchers for JUnit assertions (transitive dependency)

## Test Coverage

The JUnit test suite (`AppTest.java`) includes:

1. **testCheesePizzaOrder()** - Verifies cheese pizza creation and naming
2. **testGlutenFreePizzaOrder()** - Verifies gluten-free pizza creation and naming  
3. **testGreekPizzaOrder()** - Verifies Greek pizza creation and naming
4. **testPeperoniPizzaOrder()** - Verifies pepperoni pizza creation and naming
5. **testUnknownPizzaType()** - Verifies proper exception handling for invalid types

## Maven Benefits Demonstrated

1. **Standardized project structure** - src/main/java, src/test/java
2. **Dependency management** - Automatic JUnit download and classpath management
3. **Build lifecycle** - Compile, test, package phases
4. **Plugin integration** - Compiler, Surefire (testing), Exec plugins
5. **Reproducible builds** - Same results across different environments

## Architecture Benefits

- **Separation of concerns** - Each class has a single responsibility
- **Open/Closed principle** - Easy to add new pizza types without modifying existing code
- **Dependency inversion** - PizzaStore depends on abstraction (Pizza), not concrete classes
- **Factory encapsulation** - Pizza creation logic centralized and hidden

## How to Download and Run

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd CSE2102_Labs/Lab-3/pizza-factory-app
   ```

2. **Build the project:**
   ```bash
   mvn clean compile
   ```

3. **Run tests:**
   ```bash
   mvn test
   ```

4. **Run the application:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.example.App"
   ```

## Lab Assignment Completion

This lab successfully demonstrates:
- ✅ **Lab-02 code migrated to Maven structure**
- ✅ **Maven build system working** (`mvn clean compile`)
- ✅ **Maven testing working** (`mvn test`) with JUnit 4
- ✅ **Proper package structure** (com.example)
- ✅ **All unit tests passing** (5/5 tests successful)
- ✅ **Main application executable** via Maven
- ✅ **Complete documentation** with build/run instructions

## Author

Created as part of CSE2102 Lab Assignment 3 - Basic Maven  
Converting Lab 2's Factory Pattern implementation to Maven project structure.

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