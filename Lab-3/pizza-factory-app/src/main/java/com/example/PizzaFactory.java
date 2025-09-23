package com.example;

public class PizzaFactory {
    public Pizza createPizza(String type) {
        switch (type.toLowerCase()) {
            case "cheese":
                return new CheesePizza();
            case "greek":
                return new GreekPizza();
            case "peperoni":
                return new PeperoniPizza();
            case "glutenfree":
                return new GlutenFreePizza();
            default:
                throw new IllegalArgumentException("Unknown pizza type: " + type);
        }
    }
}