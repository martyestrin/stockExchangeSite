import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/LoginUser")
public class LoginServlet extends HttpServlet {

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
	    
	    PrintWriter out = response.getWriter();
	    JsonObject responseJson = new JsonObject();
	
	    int loginSuccess = loginUser(username, password);
	    System.out.println("login = " + loginSuccess);
	    if (loginSuccess == -100) {
	    	System.out.println("Sending bad response");
	    	responseJson.addProperty("success", false);
	        //responseJson.addProperty("message", "Invalid username or password");
	        out.println(gson.toJson(responseJson));
	        return;
	    }
	
	    
	
	    responseJson.addProperty("success", true);
	    responseJson.addProperty("message", "Login Successful");
	    responseJson.addProperty("studentID", loginSuccess);  
	    out.println(gson.toJson(responseJson));
    }

    private int loginUser(String username, String password) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                 PreparedStatement pst = conn.prepareStatement(
                    "SELECT username, pwd, studentID FROM UserAccounts WHERE username = ?")) {
                
                pst.setString(1, username);
                ResultSet rs = pst.executeQuery();
               

                if (rs.next()) {
                    String storedPassword = rs.getString("pwd");

                    if (storedPassword.equals(password)) {
                    	System.out.println("pass match");
                    	return rs.getInt("studentID");
                    }
                    System.out.println("pass  no match");
                    return -100;
                }
                System.out.println("no username ");
                return -100;
            }
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage());
            return -1;
        } catch (ClassNotFoundException e) {
            System.out.println("JDBC Driver not found: " + e.getMessage());
            return -2;
        } catch(Exception e) {
        	System.out.println("error 100");
        	return -100;
        }
    }

    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	 	String username = request.getParameter("username");  
	    int balance = getUserBalance(username);
	    response.setContentType("application/json");
	    PrintWriter out = response.getWriter();
	    JsonObject responseData = new JsonObject();
	    responseData.addProperty("balance", balance);
	    out.println(responseData.toString());
    }
    
    private int getUserBalance(String username) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                 PreparedStatement pst = conn.prepareStatement("SELECT balance FROM UserAccounts WHERE username = ?")) {

                pst.setString(1, username);  
                ResultSet rs = pst.executeQuery();

                if (rs.next()) {
                    return rs.getInt("balance");  
                }
            }
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage());
            return -1;  
        } catch (ClassNotFoundException e) {
            System.out.println("JDBC Driver not found: " + e.getMessage());
            return -1;  
        }
        return -1; 
    }
    
    
}
