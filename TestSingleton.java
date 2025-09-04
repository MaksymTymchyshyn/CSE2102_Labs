//package patterns;

public class TestSingleton {
	
	public static void main(String[] args) {
		
		Singleton so_1 = Singleton.getInstance();
		Singleton so_2 = Singleton.getInstance();

		System.out.print("SingletonObject: ");
		if (so_1 == so_2) {
			System.out.println("Same object instances");
		} else {
			System.out.println("Different object instances");
		}
		
		NonSingleton ns_1 = new NonSingleton();
		NonSingleton ns_2 = new NonSingleton();
		
		System.out.print("Nonsingleton: ");
		if (ns_1 == ns_2) {
			System.out.println("Same object instances");
		} else {
			System.out.println("Different object instances");
		}
	}
}