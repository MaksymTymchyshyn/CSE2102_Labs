# Lab 3: Basic Maven - Pizza Factory Project

This project demonstrates the conversion of Lab 2's Pizza Factory implementation into a Maven-based project structure. The application implements the Factory Design Pattern for a pizza ordering system.

## Project Overview

This Maven project converts the Lab 2 pizza factory system to demonstrate:
- Maven project structure and build lifecycle
- JUnit 4 testing framework integration
- Factory Design Pattern implementation
- Clean separation of source code and tests

## Project Structure

```
Lab_3/pizza-factory-maven/
├── pom.xml                           # Maven project configuration
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           └── example/
│   │               ├── Main.java             # Application entry point
│   │               ├── Pizza.java            # Abstract base class
│   │               ├── PizzaFactory.java     # Factory implementation
│   │               ├── PizzaStore.java       # Store using factory
│   │               ├── CheesePizza.java      # Concrete pizza types
│   │               ├── GreekPizza.java
│   │               ├── PeperoniPizza.java
│   │               └── GlutenFreePizza.java
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── PizzaStoreTest.java   # JUnit 4 test suite
└── README.md                         # This file
```

## Design Pattern

The Factory Pattern implementation includes:
- **Pizza**: Abstract base class defining common pizza operations
- **Concrete Pizza Classes**: CheesePizza, GreekPizza, PeperoniPizza, GlutenFreePizza
- **PizzaFactory**: Creates concrete pizza instances based on type
- **PizzaStore**: Uses factory to create and process pizza orders
- **Main**: Demonstrates the system in action

## Prerequisites

- Java Development Kit (JDK) 11 or higher
- Apache Maven 3.6 or higher

## Build and Run Instructions

### 1. Navigate to Project Directory
```bash
cd Lab_3/pizza-factory-maven
```

### 2. Clean and Compile (Required)
```bash
mvn clean compile
```

### 3. Run Tests (Required)
```bash
mvn test
```

### 4. Run the Application
```bash
mvn exec:java -Dexec.mainClass="com.example.Main"
```

## Expected Output

### mvn clean compile
```
[INFO] BUILD SUCCESS
[INFO] Compiling 8 source files to target/classes
```

### mvn test
```
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Application Run
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

## Maven Dependencies

- **JUnit 4.13.2**: Testing framework for unit tests
- **Maven Compiler Plugin 3.8.1**: Java compilation
- **Maven Surefire Plugin 3.0.0-M7**: Test execution

## Test Coverage

The test suite includes:
1. **testCheesePizzaOrder()** - Verifies cheese pizza creation
2. **testGlutenFreePizzaOrder()** - Verifies gluten-free pizza creation
3. **testGreekPizzaOrder()** - Verifies Greek pizza creation
4. **testPeperoniPizzaOrder()** - Verifies pepperoni pizza creation
5. **testUnknownPizzaType()** - Verifies exception handling for invalid types

## Key Maven Features Demonstrated

1. **Standard Directory Layout**: src/main/java and src/test/java
2. **Dependency Management**: Automatic JUnit download and classpath management
3. **Build Lifecycle**: Clean, compile, test phases
4. **Plugin Configuration**: Compiler and test plugins
5. **Package Structure**: Proper Java package organization

## What Was Converted from Lab 2

- ✅ All Java source files moved to Maven structure
- ✅ Added package declarations (com.example)
- ✅ Converted tests to use JUnit 4
- ✅ Created proper Maven pom.xml configuration
- ✅ Added comprehensive test coverage
- ✅ Maintained Factory Pattern implementation

## Repository and Download Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd CSE2102_Labs/Lab_3/pizza-factory-maven
   ```

2. **Build the project:**
   ```bash
   mvn clean compile
   ```

3. **Run tests:**
   ```bash
   mvn test
   ```

4. **Execute the application:**
   ```bash
   mvn exec:java -Dexec.mainClass="com.example.Main"
   ```

## Lab Assignment Completion

This project successfully demonstrates:
- ✅ Lab 2 converted to Maven structure
- ✅ `mvn clean compile` working correctly
- ✅ `mvn test` running with JUnit 4
- ✅ All unit tests passing (5/5)
- ✅ Factory Pattern preserved and enhanced
- ✅ Proper Maven project structure
- ✅ Complete documentation and instructions

## Author

Lab 3 implementation for CSE2102 - Software Engineering  
Converting Lab 2 Pizza Factory to Maven project structure