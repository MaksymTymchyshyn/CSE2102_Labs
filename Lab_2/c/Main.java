public class Main {
    public static void main(String[] args) {
        PizzaFactory factory = new PizzaFactory();
        PizzaStore store = new PizzaStore(factory);

        System.out.println("Ordering a Cheese Pizza:");
        store.orderPizza("cheese");

        System.out.println("\nOrdering a Greek Pizza:");
        store.orderPizza("greek");
    }
}
