package c;

public interface Electric {
    void setCostPerKWh(double cost);
    double getCostPerKWh();

    void setMilesPerKWh(double milesPerKWh);
    double getMilesPerKWh();

    /** Cost of a trip in electric mode for a given distance (miles). */
    double calculateElectricTripCost(double miles);

    /** MPGe = (miles / kWhUsed) * 33.7 */
    double calculateMPGe(double miles, double kWhUsed);
}
