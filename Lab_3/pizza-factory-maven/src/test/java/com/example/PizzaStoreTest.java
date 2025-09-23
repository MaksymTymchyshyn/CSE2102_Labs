package com.example;

import static org.junit.Assert.*;
import org.junit.Test;

public class PizzaStoreTest {
    
    @Test
    public void testCheesePizzaOrder() {
        PizzaFactory factory = new PizzaFactory();
        PizzaStore store = new PizzaStore(factory);

        Pizza pizza = store.orderPizza("cheese");
        assertEquals("Cheese Pizza", pizza.getName());
    }

    @Test
    public void testGlutenFreePizzaOrder() {
        PizzaFactory factory = new PizzaFactory();
        PizzaStore store = new PizzaStore(factory);

        Pizza pizza = store.orderPizza("glutenfree");
        assertEquals("GlutenFree Pizza", pizza.getName());
    }

    @Test
    public void testGreekPizzaOrder() {
        PizzaFactory factory = new PizzaFactory();
        PizzaStore store = new PizzaStore(factory);

        Pizza pizza = store.orderPizza("greek");
        assertEquals("Greek Pizza", pizza.getName());
    }

    @Test
    public void testPeperoniPizzaOrder() {
        PizzaFactory factory = new PizzaFactory();
        PizzaStore store = new PizzaStore(factory);

        Pizza pizza = store.orderPizza("peperoni");
        assertEquals("Peperoni Pizza", pizza.getName());
    }

    @Test
    public void testUnknownPizzaType() {
        PizzaFactory factory = new PizzaFactory();
        
        try {
            factory.createPizza("unknown");
            fail("Expected IllegalArgumentException");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("Unknown pizza type"));
        }
    }
}