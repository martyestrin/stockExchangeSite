import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;


@WebServlet("/RegisterUser")
public class RegisterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final String sqlUsername = "root";
    private static final String sqlPassword = "rockstar18"; 
    private static final String connectionString = "jdbc:mysql://localhost/UsersDB";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    StringBuilder sb = new StringBuilder();
	    BufferedReader reader = request.getReader();
	    String line;
	    while ((line = reader.readLine()) != null) {
	        sb.append(line);
	    }
	    String jsonData = sb.toString();

	    Gson gson = new Gson();
	    JsonObject jsonObject = gson.fromJson(jsonData, JsonObject.class);
	    String username = jsonObject.get("username").getAsString();
	    String password = jsonObject.get("password").getAsString();
	    String email = jsonObject.get("email").getAsString();
	    String password2 = jsonObject.get("password2").getAsString(); 
        
        int registrationResult = 0;
        boolean error = false;
        registrationResult = registerUser(username, password, email, error);
        System.out.println(error);
        if (registrationResult == 100) {
        	JsonObject responseJson = new JsonObject();
            PrintWriter out = response.getWriter();
            responseJson.addProperty("success", false);
            out.println(gson.toJson(responseJson));
        	return;
        }
    
        JsonObject responseJson = new JsonObject();
        PrintWriter out = response.getWriter();
        responseJson.addProperty("success", true);
        responseJson.addProperty("message", "Login Successful");
        responseJson.addProperty("password", password);
        responseJson.addProperty("username", username);
        responseJson.addProperty("email", email);
        responseJson.addProperty("balance", 50000);
        responseJson.addProperty("studentID", registrationResult);
        System.out.println("student id = " + registrationResult);
        out.println(gson.toJson(responseJson));
        out.close();
    }

    private Integer registerUser(String username, String password, String email, boolean error) 
    {
        int userID = -1;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                 PreparedStatement pst = conn.prepareStatement(
                    "INSERT INTO UserAccounts (email, pwd, username) VALUES (?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS)) {
                
                pst.setString(1, email);
                pst.setString(2, password);
                pst.setString(3, username);

                int affectedRows = pst.executeUpdate();

                //Chat GPT: Asked to get the userID primary keys from this function https://chat.openai.com/c/ccd9c1d2-3fcc-43b6-a29b-2772d8797505
                if (affectedRows > 0) {
                	System.out.println("affected rows = " + affectedRows);
                    try (ResultSet generatedKeys = pst.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            userID = generatedKeys.getInt(1);
                            System.out.println("user id = " + userID);
                            return userID;
                        }
                    }
                }
                
            }
            System.out.println(username);
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage()); 
            error = true;
            return 100;
        } catch (ClassNotFoundException e) {
            System.out.println("JDBC Driver not found: " + e.getMessage()); 
            return -3;
        }
        System.out.println("got thru it");
        return userID;
    }
}
