//package patterns;

public class Singleton {
	
	private Singleton() { value++; }
	
	private static Singleton CLASS_INSTANCE = new Singleton();
	protected int value = 0;
	public static Singleton getInstance() {
		return CLASS_INSTANCE;
	}
}