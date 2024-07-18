function fetchStockData() 
{
    var symbol = document.getElementById('stockSymbol').value;
    if (!symbol) {
        alert('Please enter a stock ticker.');
        return;
    }

    fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getStockData?symbol=' + symbol)
        .then(response => response.json())
        .then(data => {
			console.log(data); 
            displayStockData(data);
            hideSearchElements(); 
        })
}

function displayStockData(data) 
{
    var display = document.getElementById('stockData');
    const user = JSON.parse(localStorage.getItem('user')); 

    if (user) loggedInDisplay(data);
    else display.innerHTML = guestDisplay(data);
}

function guestDisplay(data) 
{
    return `
        <div id="ticker">
            <p>${data.profile.ticker}</p>
        </div>
        <div id ="name">
            <p>${data.profile.name}</p>
        </div>
        <div id ="exchange">
            <p>${data.profile.exchange}</p>
        </div>
        <h2 class="center2" id="summary">Summary</h2>
        <div class="grey-line"></div>
        <div id="centeredData">
            <p>High Price: ${data.quote.h}</p>
            <p>Low Price: ${data.quote.l}</p>
            <p>Open Price: ${data.quote.o}</p>
            <p>Close Price: ${data.quote.pc}</p>
        </div>
        <div class="grey-line"></div>
        <h2 class="center2" id="companyInfoTitle">Company Information</h2>
        <div id="leftAlignedData">
            <p><strong>IPO Date:</strong> ${data.profile.ipo}</p>
            <p><strong>Market Cap (SM):</strong> ${data.profile.marketCapitalization}</p>
            <p><strong>Shares Outstanding:</strong> ${data.profile.shareOutstanding}</p>
            <p><strong>Website:</strong> <a href="${data.profile.weburl}">${data.profile.weburl}</a></p>
            <p><strong>Phone:</strong> ${data.profile.phone}</p>
        </div>
    `;
}

//Chat GPT: How to format current date and time in MM-DD-YYYY HH-MM-SS format https://chat.openai.com/c/b1d41558-2f7e-4035-b585-06e0d0c4aed0
function formatDateTime() {
    const now = new Date();
    const day = ('0' + now.getDate()).slice(-2);
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const year = now.getFullYear();
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);
    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
}


function loggedInDisplay(info)
{
	const tkr = info.profile.ticker;
	var updatedPrice;
	var priceChange;
	var priceChangePercentage;
	var hi;
	var lo;
	var open;
	var close;
	fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getStockData?symbol=' + tkr)
        .then(response => response.json())
        .then(data => {
			updatedPrice = data.quote.c;
			console.log("UPDATED PRICE = " + updatedPrice);
			priceChange = parseFloat(data.quote.d);
			priceChangePercentage = parseFloat(data.quote.dp);  
			open = data.quote.o;
			close = data.quote.pc;
			hi = data.quote.h;
			lo = data.quote.l;
			console.log(updatedPrice + " " + priceChange + " " + priceChangePercentage + " " + open + " " + close + " " + hi + " " + lo + " " + info);
			loggedInPrint(updatedPrice, priceChange, priceChangePercentage, open, close, hi, lo, info);
        })
}
function loggedInPrint(updatedPrice, priceChange, priceChangePercentage, open, close, hi, lo, data){
	//const priceChange = parseFloat(data.quote.d);  
    //const priceChangePercentage = parseFloat(data.quote.dp);  
	const formattedDateTime = formatDateTime(); 
   
   	//Chat GPT: How to make it so that if a positive is green a CSS element is green and if it is negative the CSS element is Red https://chat.openai.com/c/1b61d6bc-f95f-4adb-b7be-35883a6fdf80
    const arrowIcon = priceChange >= 0 ? 'fa-caret-up' : 'fa-caret-down';
    const colorClass = priceChange >= 0 ? 'green' : 'red';
    //console.log(data.quote);
    const price = data.quote.c.toFixed(2);
    console.log(formatDateTime);
    document.getElementById('stockData').innerHTML = `
       <div class="upper-data">
            <div class = "left">
                <div id="ticker" class="left-aligned">
                    <p>${data.profile.ticker}</p>
                </div>
                <div id="name" class="left-aligned">
                    <p>${data.profile.name}</p>
                </div>
                <div id="exchange" class="left-aligned">
                    <p>${data.profile.exchange}</p>
                </div>
                <div class="quantity-container">
			        <label for="quantity" style="display: inline-block; margin-right: 10px;">Quantity:</label>
			        <input type="number" id="quantity" name="quantity" min="1" step="1" style="width: 40px;">
			    </div>
			    <button type="button" onclick="buyStock()" class="buy-button">Buy</button>
            </div>
            <div class="right">
            	
                <p class="${colorClass}"><span id="price">${updatedPrice}</p>
                <p><i class="fas ${arrowIcon} ${colorClass}"></i> <span class="${colorClass}">${priceChange} (${priceChangePercentage}%)</span></p>
                <p class="${colorClass} date-time">${formattedDateTime}</p> 
            </div>
      </div>
        <div class="center2" id="marketStatus">${isMarketOpen()}</div>
        <h2 class="center2" id="summary">Summary</h2>
        <div class="grey-line"></div>
        <div id="centeredData">
            <p><strong>High Price: ${hi}</p>
            <p><strong>Low Price: ${lo}</p>
            <p><strong>Open Price: ${open}</p>
            <p id="price"><strong>Close Price: <span id="closePrice">${close}</span></p>
        </div>
        <div class="grey-line"></div>
        <h2 class="center2" id="companyInfoTitle">Company Information</h2>
        <div id="leftAlignedData">
            <p><strong>IPO Date:</strong> ${data.profile.ipo}</p>
            <p><strong>Market Cap (SM):</strong> ${data.profile.marketCapitalization}</p>
            <p><strong>Shares Outstanding:</strong> ${data.profile.shareOutstanding}</p>
            <p><strong>Website:</strong> <a href="${data.profile.weburl}">${data.profile.weburl}</a></p>
            <p><strong>Phone:</strong> ${data.profile.phone}</p>
        </div>
    `;
    
}

function isMarketOpen() {
    //Chat GPT: JS function to check if the current time is within Nasdaq operating hours https://chat.openai.com/c/7b733bf5-ca1e-4cdf-84db-9b6a6c81fe2a
    const etTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const hours = etTime.getHours();
    const minutes = etTime.getMinutes();
    const day = etTime.getDay();
    if (day >= 1 && day <= 5) {
        if ((hours > 9 || (hours === 9 && minutes >= 30)) && (hours < 16)) return "Market is Open";
    } return "Market is Closed";
}

window.onload = function() {
    updateBanner();
};


function updateBanner() 
{
    console.log('Updating banner');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User:', user);

    if (user) 
    {
        const rightLinks = document.querySelector('.right-links');
            const portfolioLink = document.createElement('a');
            portfolioLink.href = 'portfolio.html';
            portfolioLink.innerHTML = '<h3 id="right">Portfolio</h3>'; //https://chat.openai.com/c/a21274ca-7ba6-4190-bda8-c0b6e6a5949d

            const loginLink = rightLinks.querySelector('a[href="login.html"]'); //https://chat.openai.com/c/a21274ca-7ba6-4190-bda8-c0b6e6a5949d
            if (loginLink) 
            {
                const logoutLink = document.createElement('a');
                logoutLink.innerHTML = '<h3 id="right">Logout</h3>';
                logoutLink.onclick = function() 
                {
                    localStorage.removeItem('user');
                    window.location.reload();
                };
                rightLinks.insertBefore(portfolioLink, loginLink);
                rightLinks.replaceChild(logoutLink, loginLink);
            }         
    }
}


function getUsernameFromLocalStorage() 
{
    const userString = localStorage.getItem('user'); 
    if (userString) 
    {
        const userObject = JSON.parse(userString); 
        return userObject.username; 
    }
    return null; 
}

function buyStock() 
{
	var quantityInput = document.getElementById('quantity').value;
    var quantity = parseFloat(quantityInput); 
    var price = parseFloat(document.getElementById('price').innerText);
    console.log("PRICE = " + price);
    var ticker = document.getElementById('ticker').innerText;
    var companyName = document.getElementById('name').innerText;
    var username = getUsernameFromLocalStorage();
    console.log(username);
    console.log(price);
    console.log(quantity);
    
    if (!Number.isInteger(quantity) || quantity < 1) 
    {
        alert("TRANSACTION FAILED: Quantity must be an integer value > 0");
        return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    var balance = user.balance;
    if (quantity * price > balance)
    {
		alert("TRANSACTION FAILED: Inadaquate Balance. Your balance is $" + balance.toFixed(2) + ", but this transaction costs $" + (quantity * price).toFixed(2));
        return;
	}

    const data = 
    {
        username: username,
        quantity: quantity,
        price: price,
        ticker: ticker,
    	companyName: companyName
    };
    
    fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/BuyStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())  
    .then(result => {
        if (result.success) 
        {
            alert("TRANSACTION SUCCESSFUL: " + result.message);
            updateUserBalance(price*quantity);
        } 
        else ("TRANSACTION FAILED: " + result.message);
    })
}

function fetchBalance(username) 
{
	console.log(username);
    fetch(`http://localhost:8080/mzestrin_CSCI201_Assignment4-new/LoginUser?username=${encodeURIComponent(username)}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.balance !== undefined) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.balance = data.balance;
            localStorage.setItem('user', JSON.stringify(user));
        }
    })
}

function updateUserBalance(cost) 
{
    const userString = localStorage.getItem('user');
    if (userString) 
    {
		console.log("COST = " + cost);
		const user = JSON.parse(localStorage.getItem('user')); 
        user.balance = user.balance - cost;
        localStorage.setItem('user', JSON.stringify(user));
        console.log("Updated balance:", user.balance - cost);
    }
}

function hideSearchElements() 
{
    document.getElementById('searchTitle').style.display = 'none';
    document.getElementById('searchContainer').style.display = 'none';
}

