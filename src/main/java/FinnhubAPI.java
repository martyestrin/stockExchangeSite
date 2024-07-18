import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class FinnhubAPI {
    private final String apiKey;

    public FinnhubAPI(String apiKey) {
        this.apiKey = apiKey;
    }
    
    //This function: https://chat.openai.com/c/5d3ec267-9acf-4875-8b21-409eebdd67db
    private JsonObject makeRequest(String endpoint) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .GET()
                .build();
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return JsonParser.parseString(response.body()).getAsJsonObject()
	;}

    public JsonObject getStockQuote(String ticker) throws IOException, InterruptedException {
        String url = "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + this.apiKey;
        return makeRequest(url);
    } public JsonObject getCompanyProfile(String ticker) throws IOException, InterruptedException {
        String url = "https://finnhub.io/api/v1/stock/profile2?symbol=" + ticker + "&token=" + this.apiKey;
        return makeRequest(url);
    }
    public JsonObject getAllData(String ticker) throws IOException, InterruptedException {
        String quoteUrl = "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + this.apiKey;
        JsonObject quoteData = makeRequest(quoteUrl);
        
        String profileUrl = "https://finnhub.io/api/v1/stock/profile2?symbol=" + ticker + "&token=" + this.apiKey;
        JsonObject profileData = makeRequest(profileUrl);
        
        JsonObject allData = new JsonObject();
        allData.add("quote", quoteData);
        allData.add("profile", profileData);
        return allData;
    }

    public double getOpenPrice(String ticker) throws IOException, InterruptedException {
        JsonObject response = getStockQuote(ticker);
        return response.get("o").getAsDouble();
    }

    public double getClosePrice(String ticker) throws IOException, InterruptedException {
        JsonObject response = getStockQuote(ticker);
        return response.get("pc").getAsDouble();
    }
    
    public double getCurrentPrice(String ticker) throws IOException, InterruptedException {
        JsonObject response = getStockQuote(ticker);
        return response.get("c").getAsDouble();
    }

    public double getHighPrice(String ticker) throws IOException, InterruptedException {
        JsonObject response = getStockQuote(ticker);
        return response.get("h").getAsDouble();
    }

    public double getLowPrice(String ticker) throws IOException, InterruptedException {
        JsonObject response = getStockQuote(ticker);
        return response.get("l").getAsDouble();
    }

    public String getIPODate(String ticker) throws IOException, InterruptedException {
        JsonObject response = getCompanyProfile(ticker);
        return response.get("ipo").getAsString();
    }

    public String getPhoneNumber(String ticker) throws IOException, InterruptedException {
        JsonObject response = getCompanyProfile(ticker);
        return response.get("phone").getAsString();
    }

    public long getMarketCap(String ticker) throws IOException, InterruptedException {
        JsonObject response = getCompanyProfile(ticker);
        return response.get("marketCapitalization").getAsLong();
    }

    public String getWebsite(String ticker) throws IOException, InterruptedException {
        JsonObject response = getCompanyProfile(ticker);
        return response.get("weburl").getAsString();
    }

    public long getSharesOutstanding(String ticker) throws IOException, InterruptedException {
        JsonObject response = getCompanyProfile(ticker);
        return response.get("shareOutstanding").getAsLong();
    }
}
