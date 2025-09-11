package c;

public interface Gasoline {
    void setCostPerGallon(double cost);
    double getCostPerGallon();

    void setMPG(double mpg);
    double getMPG();

    /** Cost of a trip in gasoline mode for a given distance (miles). */
    double calculateGasTripCost(double miles);
}
