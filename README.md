# Lab 1 – Basic JUnit 4
This lab is a small Java program to practice unit testing with JUnit 4.

I created two interfaces:
- Gasoline – has methods for cost per gallon, MPG, and to calculate the cost of a gas trip.
- Electric – has methods for cost per kWh, miles per kWh, MPGe calculation, and to calculate the cost of an electric trip.

I then made a HybridVehicle class that implements both interfaces. It can calculate:
- Gas trip cost
- Electric trip cost
- MPGe (miles per gallon equivalent)
- Hybrid average = (MPG + MPGe) / 2

I also made a CarRunner main class. It creates a HybridVehicle and prints example results.
- Scenario A uses the numbers given in the lab (20 MPG, 300 miles on 70 kWh, gas $3.50/gal, electric $0.24/kWh).
- Scenario B uses different values (28 MPG, 200 miles on 48 kWh, 150-mile trip) to show variety.

For testing, I wrote a JUnit 4 test class HybridVehicleTest. It checks:
- Gas trip cost calculation
- Electric trip cost calculation
- MPGe calculation
- Hybrid average calculation
- A second scenario with different values

To build and run:
- Download JUnit and Hamcrest jars into a jars/ folder.
- Compile with: javac -cp "jars/junit-4.13.2.jar:jars/hamcrest-core-1.3.jar:." ./c/*.java ./u/*.java
- Run the program with: java -cp "jars/junit-4.13.2.jar:jars/hamcrest-core-1.3.jar:." c.CarRunner
- Run the tests with: java -cp "jars/junit-4.13.2.jar:jars/hamcrest-core-1.3.jar:." org.junit.runner.JUnitCore u.HybridVehicleTest
