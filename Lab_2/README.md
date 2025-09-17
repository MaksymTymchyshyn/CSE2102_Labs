# Lab 2: Pizza Factory Pattern

This project demonstrates the **Factory Design Pattern** implementation for a pizza ordering system. The Factory pattern provides a way to create objects without specifying the exact class of object that will be created.

## Project Structure

```
Lab_2/
├── c/                          # Source code directory
│   ├── Main.java              # Main application entry point
│   ├── Pizza.java             # Abstract base class for all pizzas
│   ├── PizzaFactory.java      # Factory class for creating pizzas
│   ├── PizzaStore.java        # Pizza store that uses the factory
│   ├── CheesePizza.java       # Concrete cheese pizza implementation
│   ├── GlutenFreePizza.java   # Concrete gluten-free pizza implementation
│   ├── GreekPizza.java        # Concrete Greek pizza implementation
│   └── PeperoniPizza.java     # Concrete pepperoni pizza implementation
├── u/                         # Unit tests directory
│   └── PizzaStoreTest.java    # JUnit tests for the pizza store
├── jars/                      # External libraries
│   ├── junit-4.13.2.jar      # JUnit testing framework
│   └── hamcrest-core-1.3.jar  # Hamcrest matchers for JUnit
└── README.md                  # This file
```

## Design Pattern Overview

The **Factory Pattern** is implemented through these key components:

- **Pizza (Abstract Product)**: Base class defining the pizza interface
- **Concrete Products**: CheesePizza, GlutenFreePizza, GreekPizza, PeperoniPizza
- **PizzaFactory (Factory)**: Creates concrete pizza instances based on type
- **PizzaStore (Client)**: Uses the factory to create and process pizza orders

## Pizza Types

The system supports the following pizza types:

1. **Cheese Pizza** - Classic cheese pizza
2. **Greek Pizza** - Traditional Greek-style pizza
3. **Pepperoni Pizza** - Pizza with pepperoni toppings
4. **Gluten-Free Pizza** - Special gluten-free option

## How to Run

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Terminal/Command prompt access

### Running the Main Program

1. **Navigate to the Lab_2 directory:**
   ```bash
   cd Lab_2
   ```

2. **Compile all source files:**
   ```bash
   javac -cp "jars/*:." c/*.java u/*.java
   ```

3. **Run the main program:**
   ```bash
   java -cp ".:c" Main
   ```

**Expected Output:**
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
```

### Running Unit Tests

**Execute the JUnit tests:**
```bash
java -cp "jars/*:.:c:u" org.junit.runner.JUnitCore PizzaStoreTest
```

**Expected Output:**
```
JUnit version 4.13.2
.GlutenFree Pizza is being prepared.
GlutenFree Pizza is being baked.
GlutenFree Pizza is being cut.
GlutenFree Pizza is being boxed.
.Cheese Pizza is being prepared.
Cheese Pizza is being baked.
Cheese Pizza is being cut.
Cheese Pizza is being boxed.

Time: 0.035

OK (2 tests)
```

## Code Explanation

### Factory Pattern Implementation

1. **PizzaFactory**: The factory class that encapsulates pizza creation logic
   - Takes a string parameter specifying pizza type
   - Returns appropriate concrete pizza instance
   - Handles unknown types with exceptions

2. **Pizza Hierarchy**: Abstract base class with concrete implementations
   - Each pizza type sets its own name in the constructor
   - Common operations: prepare(), bake(), cut(), box()

3. **PizzaStore**: Client class that uses the factory
   - Delegates pizza creation to the factory
   - Handles the pizza preparation process
   - Returns the completed pizza object

### Benefits of This Design

- **Encapsulation**: Pizza creation logic is centralized in the factory
- **Extensibility**: New pizza types can be added easily
- **Loose Coupling**: PizzaStore doesn't need to know about specific pizza classes
- **Single Responsibility**: Each class has a clear, focused purpose

## Testing

The project includes unit tests that verify:
- Correct pizza creation for different types
- Proper pizza naming
- Factory method functionality

Tests ensure the factory pattern implementation works correctly and maintains expected behavior.