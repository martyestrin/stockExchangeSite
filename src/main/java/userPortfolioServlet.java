import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@WebServlet("/getUserStocks")
public class userPortfolioServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L; 
    private static final String sqlUsername = "root";
    private static final String sqlPassword = "rockstar18"; 
    private static final String connectionString = "jdbc:mysql://localhost/UsersDB";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	System.out.println("in function do post");
    	StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        String jsonData = sb.toString();
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(jsonData, JsonObject.class);
        int id = jsonObject.get("id").getAsInt();

        HashMap<String, Trade> portfolio = getPortfolio(id);
        if (portfolio == null) 
        {
        	System.out.println("PROBLEM");
            return;
        }
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(portfolio)); 
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
    	System.out.println("do get");
	    response.setContentType("application/json");
	    PrintWriter out = response.getWriter();
	    Gson gson = new Gson();

	    String userIdStr = request.getParameter("id");
	    if (userIdStr == null || userIdStr.isEmpty()) return;

	    int id;
	    try {
	        id = Integer.parseInt(userIdStr);
	    } catch (Exception e) {
	        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	        out.println(gson.toJson("Error:"));
	        return;
	    }

	    HashMap<String, Trade> portfolio = getPortfolio(id);
	    if (portfolio == null) {
	        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	        out.println(gson.toJson("Error retrieving portfolio, PORTFOLIO NULL"));
	        return;
	    }

        double totalValue = 0;
        for (Trade t : portfolio.values()) {
        	try {
				totalValue += (PortfolioServlet.finnhubApi.getCurrentPrice(t.getTicker()) * t.getQuantity());
			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
        }
        System.out.println("total val = " + totalValue);

        response.getWriter().write(gson.toJson(totalValue));
    }
    
    public int getQuantity(String ticker, int id)
    {
    	HashMap<String, Trade> data = getPortfolio(id);
    	return data.get(ticker).getQuantity();
    }
    
    private HashMap<String, Trade> getPortfolio(int id) 
    {
    	HashMap<String, Trade> stocks = new HashMap<String, Trade>();
    	try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(connectionString, sqlUsername, sqlPassword);
                 PreparedStatement pst = conn.prepareStatement(
                    "SELECT ticker, companyName, quantity, totalCost FROM UserTrades WHERE studentID = ?")) {
                
                pst.setInt(1, id);
                ResultSet rs = pst.executeQuery();

                while (rs.next()) 
                {
                    String ticker = rs.getString("ticker");
                    if (stocks.containsKey(ticker)) 
                    {
                    	stocks.get(ticker).setQuantity(rs.getInt("quantity") + stocks.get(ticker).getQuantity());
                    	stocks.get(ticker).setTotalCost(rs.getDouble("totalCost") + stocks.get(ticker).getTotalCost());
                    }
                    else 
                    {
                    	Trade trade = new Trade(rs.getString("ticker"), rs.getString("companyName"), rs.getInt("quantity"), rs.getDouble("totalCost"));
                    	stocks.put(ticker, trade);
                    }
                }
            }
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage());
            return null;
        } catch (ClassNotFoundException e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    	return stocks;
    }
}
