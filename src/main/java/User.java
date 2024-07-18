import java.util.ArrayList;
import java.util.HashMap;

public class User
{
	private String email;
	private String password;
	private String username;
	private int id;
	private HashMap<String, Trade> portfolio;
	
	public User(String email, String password, int id, String username) {
		this.email = email;
		this.password = password;
		this.id = id;
		this.username = username;
	}
	public User(String email, String password, String username) {
		this.email = email;
		this.password = password;
		this.username = username;
		id = 0;
	}
	public User() {
		email = "";
		password = "";
		id = 0;
		username = "";
	}
	
	public void addTrade(Trade trade){
		boolean repurchase = false;
		for (Trade stock : portfolio.values()) {
			if (stock.getTicker() == trade.getTicker()) {
				repurchase = true;
			}
		}
		if (repurchase) {
			portfolio.get(trade.getTicker()).setQuantity(trade.getQuantity() + portfolio.get(trade.getTicker()).getQuantity());
			portfolio.get(trade.getTicker()).setTotalCost(trade.getTotalCost() + portfolio.get(trade.getTicker()).getTotalCost());
		} else {
			portfolio.put(trade.getTicker(), trade);
		}
	}

	public void setUsername(String username) {
		this.username = username;
	}
	public void setID(int id) {
		this.id = id;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUsername() {
		return this.username;
	}
	public int getID() {
		return id;
	}
	public String getEmail() {
		return email;
	}
	public String getPassword() {
		return password;
	}
}



