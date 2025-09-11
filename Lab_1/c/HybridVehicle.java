package c;

public class HybridVehicle implements Gasoline, Electric {
    private double costPerGallon;
    private double mpg;

    private double costPerKWh;
    private double milesPerKWh;

    // ---------------- Gasoline ----------------
    @Override
    public void setCostPerGallon(double cost) { this.costPerGallon = cost; }

    @Override
    public double getCostPerGallon() { return this.costPerGallon; }

    @Override
    public void setMPG(double mpg) { this.mpg = mpg; }

    @Override
    public double getMPG() { return this.mpg; }

    @Override
    public double calculateGasTripCost(double miles) {
        if (mpg <= 0) throw new IllegalStateException("MPG must be > 0");
        double gallons = miles / mpg;
        return gallons * costPerGallon;
    }

    // ---------------- Electric ----------------
    @Override
    public void setCostPerKWh(double cost) { this.costPerKWh = cost; }

    @Override
    public double getCostPerKWh() { return this.costPerKWh; }

    @Override
    public void setMilesPerKWh(double milesPerKWh) { this.milesPerKWh = milesPerKWh; }

    @Override
    public double getMilesPerKWh() { return this.milesPerKWh; }

    @Override
    public double calculateElectricTripCost(double miles) {
        if (milesPerKWh <= 0) throw new IllegalStateException("milesPerKWh must be > 0");
        double kWhUsed = miles / milesPerKWh;
        return kWhUsed * costPerKWh;
    }

    @Override
    public double calculateMPGe(double miles, double kWhUsed) {
        if (kWhUsed <= 0) throw new IllegalArgumentException("kWhUsed must be > 0");
        return (miles / kWhUsed) * 33.7;
    }

    // ---------------- Hybrid helper ----------------
    /** Simple hybrid "average MPG" as defined by the lab: (MPG + MPGe)/2 */
    public double calculateHybridAverage(double milesForMPGe, double kWhForMPGe) {
        double mpge = calculateMPGe(milesForMPGe, kWhForMPGe);
        return (getMPG() + mpge) / 2.0;
    }
}
