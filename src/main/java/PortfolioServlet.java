import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/getStockData")
public class PortfolioServlet extends HttpServlet {
	public ArrayList<User> users;
    public static FinnhubAPI finnhubApi = new FinnhubAPI("codn6e1r01qtukbjlmb0codn6e1r01qtukbjlmbg");
    private static final long serialVersionUID = 1L;
    private static final String sqlUsername = "root";
    private static final String sqlPassword = "rockstar18"; 
    private static final String connectionString = "jdbc:mysql://localhost/UsersDB";
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	//Reused some code from Assignment 3 for Finhub API
    	resp.setHeader("Access-Control-Allow-Origin", "*"); 
        String symbol = req.getParameter("symbol");
        if (symbol == null || symbol.isEmpty()) {
            resp.getWriter().write("Stock symbol is required");
            return;
        }
        try {
            JsonObject stockData = finnhubApi.getAllData(symbol);
            System.out.println(stockData.toString());
            resp.setContentType("application/json");
            resp.getWriter().write(stockData.toString());
        } catch (Exception e) {
            resp.getWriter().write("Error fetching stock data");
        }
    }
    
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
    	
    	try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword)){
            	
            	int id = jsonObject.get("id").getAsInt();
            	String ticker = jsonObject.get("ticker").getAsString();
            	int tradeQuantity = jsonObject.get("quantity").getAsInt();
                double tradeCost = jsonObject.get("cost").getAsDouble();
                
                String selectQuery = "SELECT quantity, totalCost FROM UserTrades WHERE studentID = ? AND ticker = ?";
                try (PreparedStatement pst = conn.prepareStatement(selectQuery)) {
	                pst.setInt(1, id);
	                pst.setString(2, ticker);
	                ResultSet rs = pst.executeQuery();
	                if (rs.next()) {
	                    int currentQuantity = rs.getInt("quantity");
	                    double currentTotalCost = rs.getDouble("totalCost");

	                    int newQuantity = currentQuantity + tradeQuantity;
	                    double newTotalCost = currentTotalCost + tradeCost;

	                    if (newQuantity <= 0) {
	                        String deleteQuery = "DELETE FROM UserTrades WHERE studentID = ? AND ticker = ?";
	                        try (PreparedStatement deletePst = conn.prepareStatement(deleteQuery)) {
	                            deletePst.setInt(1, id);
	                            deletePst.setString(2, ticker);
	                            deletePst.executeUpdate();
	                        }
	                    } else {
	                        String updateQuery = "UPDATE UserTrades SET quantity = ?, totalCost = ? WHERE studentID = ? AND ticker = ?";
	                        try (PreparedStatement updatePst = conn.prepareStatement(updateQuery)) {
	                            updatePst.setInt(1, newQuantity);
	                            updatePst.setDouble(2, newTotalCost);
	                            updatePst.setInt(3, id);
	                            updatePst.setString(4, ticker);
	                            updatePst.executeUpdate();
	                        }
	                    }
	                  
	                }
                }
             
                
            }
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

}
