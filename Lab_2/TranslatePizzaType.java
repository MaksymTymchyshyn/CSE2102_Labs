public enum PizzaType {
    Cheese,
    Greek,
    Peperoni,
    GlutenFree,
    Vegan
}

public class TranslatePizzaType {

    public static String fromPizzaTypeEnumToString(PizzaType pizzaType) {
        if (pizzaType == null) {
            return "Unknown";
        }

        switch (pizzaType) {
            case Cheese:
                return "Cheese";
            case Peperoni:
                return "Peperoni";
            case Greek:
                return "Greek";
            case GlutenFree:
                return "GlutenFree";
            case Vegan:
                return "Vegan";
            default:
                return "Unknown";
        }
    }

}