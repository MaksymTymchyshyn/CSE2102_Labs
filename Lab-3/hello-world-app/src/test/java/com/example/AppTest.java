import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class AppTest {

    @Test
    public void testMain() {
        // Redirecting the output to capture it for verification
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintStream printStream = new PrintStream(outputStream);
        PrintStream originalOut = System.out;
        System.setOut(printStream);

        // Call the main method of the App class
        App.main(new String[]{});

        // Reset the output
        System.out.flush();
        System.setOut(originalOut);

        // Verify the output
        String expectedOutput = "Hello, World!\n";
        assertEquals(expectedOutput, outputStream.toString());
    }
}