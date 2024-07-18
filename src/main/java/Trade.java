public class Trade
{
	private String ticker;
	private String companyName;
	private int quantity;
	private double totalCost;
	
	public Trade() 
	{
		ticker = "";
		companyName = "";
		quantity = 0;
		totalCost = 0;
	}
	
	public Trade(String ticker, String companyName, int quantity, double totalCost) 
	{
		this.ticker = ticker;
		this.companyName = companyName;
		this.quantity = quantity;
		this.totalCost = totalCost;
	}
	
	public String getTicker() {return ticker;}
	public String getCompanyName() {return companyName;}
	public int getQuantity() {return quantity;}
	public double getTotalCost() {return totalCost;}
	
	public void setTicker(String ticker) {this.ticker = ticker;}
	public void setCompanyName(String companyName) {this.companyName = companyName;}
	public void setQuantity(int quantity) {this.quantity = quantity;}
	public void setTotalCost(double totalCost) {this.totalCost = totalCost;}
}

