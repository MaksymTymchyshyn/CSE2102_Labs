package c;

public class CarRunner {
    public static void main(String[] args) {
        HybridVehicle car = new HybridVehicle();

        // ---------- Scenario A (from lab instructions) ----------
        car.setCostPerGallon(3.50);
        car.setMPG(20.0);

        car.setCostPerKWh(0.24);
        car.setMilesPerKWh(300.0 / 70.0); // ≈ 4.2857 mi/kWh

        double gasTripCostA = car.calculateGasTripCost(120);
        double mpgeA = car.calculateMPGe(300, 70); // = 144.43 MPGe
        double elecTripCostA = car.calculateElectricTripCost(120);
        double hybridAvgA = car.calculateHybridAverage(300, 70);

        System.out.println("=== Scenario A ===");
        System.out.println("Gasoline trip cost (120 miles @ 20 MPG, $3.50/gal): $" + String.format("%.2f", gasTripCostA));
        System.out.println("Electric MPGe (300 miles / 70 kWh): " + String.format("%.2f", mpgeA));
        System.out.println("Electric trip cost (120 miles @ $0.24/kWh): $" + String.format("%.2f", elecTripCostA));
        System.out.println("Hybrid average MPG ( (MPG + MPGe) / 2 ): " + String.format("%.2f", hybridAvgA));
        System.out.println();

        // ---------- Scenario B ----------
        car.setMPG(28.0);                // Better gas efficiency
        car.setMilesPerKWh(4.0);         // Slightly different electric efficiency
        car.setCostPerGallon(3.50);
        car.setCostPerKWh(0.24);

        double gasTripCostB = car.calculateGasTripCost(150);  // Different trip miles
        // For MPGe example, say 200 miles using 48 kWh
        double mpgeB = car.calculateMPGe(200, 48);
        double elecTripCostB = car.calculateElectricTripCost(150);
        double hybridAvgB = (car.getMPG() + mpgeB) / 2.0;

        System.out.println("=== Scenario B ===");
        System.out.println("Gasoline trip cost (150 miles @ 28 MPG, $3.50/gal): $" + String.format("%.2f", gasTripCostB));
        System.out.println("Electric MPGe (200 miles / 48 kWh): " + String.format("%.2f", mpgeB));
        System.out.println("Electric trip cost (150 miles @ $0.24/kWh): $" + String.format("%.2f", elecTripCostB));
        System.out.println("Hybrid average MPG ( (MPG + MPGe) / 2 ): " + String.format("%.2f", hybridAvgB));
    }
}
