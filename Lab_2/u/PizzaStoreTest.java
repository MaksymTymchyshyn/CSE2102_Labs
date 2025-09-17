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
}
