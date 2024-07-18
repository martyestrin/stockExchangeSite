import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.*;
import java.sql.*;

@WebServlet("/BuyStock")
public class TradeServlet extends HttpServlet {    
    private static final long serialVersionUID = 1L;
    private static final String sqlUsername = "root";
    private static final String sqlPassword = "rockstar18"; 
    private static final String connectionString = "jdbc:mysql://localhost/UsersDB";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	response.setContentType("application/json");
    	PrintWriter out = response.getWriter();
    	System.out.println("doing post");

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
	    String q = jsonObject.get("quantity").getAsString();
	    String p = jsonObject.get("price").getAsString();
	    String ticker = jsonObject.get("ticker").getAsString();
	    String companyName = jsonObject.get("companyName").getAsString();
	    
	    double price = Double.parseDouble(p);
	    double quantity = Double.parseDouble(q);
	    System.out.println(price + " " + quantity + " " + username);
        
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                 PreparedStatement pst = conn.prepareStatement(
                    "SELECT Balance, studentID FROM UserAccounts WHERE username = ?")) {
                
                pst.setString(1, username);
                ResultSet rs = pst.executeQuery();

                if (rs.next()) 
                {
                    double currentBalance = rs.getDouble("Balance");
                    int id = rs.getInt("studentID");
                    double totalCost = price * quantity;

                    if (currentBalance >= totalCost) 
                    {
                        PreparedStatement updateStmt = conn.prepareStatement(
                            "UPDATE UserAccounts SET Balance = Balance - ? WHERE username = ?");	
                        updateStmt.setDouble(1, totalCost);
                        updateStmt.setString(2, username);
                        updateStmt.executeUpdate();

                        JsonObject responseJson = new JsonObject();
                        responseJson.addProperty("success", true);
                        responseJson.addProperty("message", "Bought " + (int) quantity + " shares of " + ticker + " for $" + String.format("%.2f", price*quantity));
                        out.println(gson.toJson(responseJson));
                        addTradeToDB(id, ticker, companyName, (int) quantity, price*quantity);   
                    } 
                    else 
                    {
                        // Insufficient funds
                        JsonObject responseJson = new JsonObject();
                        responseJson.addProperty("success", false);
                        responseJson.addProperty("message", "Insufficient balance.");
                        out.println(gson.toJson(responseJson));
                    }
                } 
                else 
                {
                    JsonObject responseJson = new JsonObject();
                    responseJson.addProperty("success", false);
                    responseJson.addProperty("message", "User not found.");
                    out.println(gson.toJson(responseJson));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            JsonObject responseJson = new JsonObject();
            responseJson.addProperty("success", false);
            responseJson.addProperty("message", "Database error: " + e.getMessage());
            out.println(gson.toJson(responseJson));
        }       
    }
    
    private void addTradeToDB(int id, String ticker, String companyName, int quantity, double totalCost) 
    {
    	 try {
             Class.forName("com.mysql.cj.jdbc.Driver");
             try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                  PreparedStatement pst = conn.prepareStatement(
                     "INSERT INTO UserTrades (studentID, ticker, companyName, quantity, totalCost) VALUES (?, ?, ?, ?, ?)",
                     Statement.RETURN_GENERATED_KEYS)) {
                 
                 pst.setInt(1, id);
                 pst.setString(2, ticker);
                 pst.setString(3, companyName);
                 pst.setInt(4, quantity);
                 pst.setDouble(5, totalCost);
                 pst.executeUpdate();
             }
         } catch (SQLException e) {
             System.out.println("SQL Error: " + e.getMessage()); 
         } catch (ClassNotFoundException e) {
             System.out.println("Error: " + e.getMessage()); 
         }
    }
}
