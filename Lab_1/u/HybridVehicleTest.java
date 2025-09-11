package u;

import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import c.HybridVehicle;

public class HybridVehicleTest {
    private HybridVehicle car;

    @Before
    public void setUp() {
        car = new HybridVehicle();
        car.setCostPerGallon(3.50);
        car.setMPG(20.0);
        car.setCostPerKWh(0.24);
        car.setMilesPerKWh(300.0 / 70.0); // ≈ 4.2857 mi/kWh
    }

    @Test
    public void testGasTripCost_ScenarioA() {
        double cost = car.calculateGasTripCost(120);
        assertEquals(21.0, cost, 1e-3); // 120/20 * 3.50
    }

    @Test
    public void testElectricTripCost_ScenarioA() {
        double cost = car.calculateElectricTripCost(120);
        // 120 miles * (70/300 kWh per mile) * $0.24 = 6.72
        assertEquals(6.72, cost, 1e-2);
    }

    @Test
    public void testMPGe_ScenarioA() {
        double mpge = car.calculateMPGe(300, 70);
        assertEquals(144.43, mpge, 0.1);
    }

    @Test
    public void testHybridAverage_ScenarioA() {
        double avg = car.calculateHybridAverage(300, 70);
        double expected = (20.0 + 144.43) / 2.0;
        assertEquals(expected, avg, 0.1);
    }

    @Test
    public void testScenarioB_DifferentNumbers() {
        // Change parameters and assert they differ from scenario A values
        car.setMPG(28.0);
        car.setMilesPerKWh(4.0);

        double gasCostB = car.calculateGasTripCost(150);    // 150/28 * 3.50 ≈ 18.75
        double elecCostB = car.calculateElectricTripCost(150); // 150/4 * 0.24 = 9.00
        double mpgeB = car.calculateMPGe(200, 48);          // ≈ 140.42

        assertEquals(18.75, gasCostB, 0.1);
        assertEquals(9.00, elecCostB, 0.01);
        assertEquals(140.42, mpgeB, 0.2);
    }
}
