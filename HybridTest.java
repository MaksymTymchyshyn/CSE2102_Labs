package c;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import static org.junit.Assert.assertTrue;

import Hybrid;

//import HybridTest;


public class HybridTest {
    private Hybrid hybrid;

    @Before
    public void setUp() {
        hybrid = new Hybrid(50, 30);
    }

    @Test
    public void testConstructorSetsInitialValues() {
        assertEquals(50, hybrid.getBatteryLevel());
        assertEquals(30, hybrid.getFuelLevel());
    }

    @Test
    public void testChargeBatterySetsBatteryTo100AndPrintsMessage() {
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));
        hybrid.chargeBattery();
        assertEquals(100, hybrid.getBatteryLevel());
        assertTrue(outContent.toString().trim().contains("Battery fully charged."));
        System.setOut(System.out);
    }

    @Test
    public void testGetBatteryLevelReturnsCorrectValue() {
        assertEquals(50, hybrid.getBatteryLevel());
        hybrid.chargeBattery();
        assertEquals(100, hybrid.getBatteryLevel());
    }

    @Test
    public void testRefuelSetsFuelTo100AndPrintsMessage() {
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));
        hybrid.refuel();
        assertEquals(100, hybrid.getFuelLevel());
        assertTrue(outContent.toString().trim().contains("Fuel tank full."));
        System.setOut(System.out);
    }

    @Test
    public void testGetFuelLevelReturnsCorrectValue() {
        assertEquals(30, hybrid.getFuelLevel());
        hybrid.refuel();
        assertEquals(100, hybrid.getFuelLevel());
    }
}