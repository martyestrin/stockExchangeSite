document.addEventListener('DOMContentLoaded', function() 
{
    updateBalanceDisplay();
    fetchPortfolioData(false, true); 
    getAccountValue();
    setupLogoutLink();
});

function getBalanceFromLocalStorage() 
{
    const userString = localStorage.getItem('user');
    console.log(userString);
    if (userString) 
    {
        const userObject = JSON.parse(userString);
        return userObject.balance;
    }
    return null;
}

function updateBalanceDisplay() 
{
    const balance = getBalanceFromLocalStorage();
    const balanceElement = document.getElementById('cashBalance');
    if (balance !== null) balanceElement.textContent = `$${parseFloat(balance).toFixed(2)}`;
    else balanceElement.textContent = 'Not available';
}

function clearPortfolioBoxes() 
{
	console.log("clearing the boxes");
    const portfolioContainer = document.querySelector('.portfolio-box');
    if (portfolioContainer) portfolioContainer.innerHTML = ''; 
}

function setupLogoutLink() 
{
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) 
    {
        logoutLink.addEventListener('click', function(event) 
        {
            event.preventDefault();  
            localStorage.removeItem('user');  
            window.location.href = 'index.html';  
        });
    } 
}


function fetchPortfolioData(clear, print) 
{
	console.log("fetching portfolio data");
    fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getUserStocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: getUserIdFromLocalStorage() }) 
    })
    .then(response => response.json())
    .then(data => {
        if (print) displayPortfolioData(data, clear, false);
    })
}


function displayPortfolioData(data, clear, fetchAgain) 
{
	console.log("displaying portfolio data");
    const container = document.querySelector('.container');

    Object.keys(data).forEach(key => {	//https://chat.openai.com/c/8da5c4d2-3b57-45f1-8087-289ff3257add, how to iterate through a map returned from http servlet java containing trade objects
		const vals1 = document.createElement('div');
		//vals1.style.marginLeft = '210px';
		vals1.style.textAlign = 'left'
		vals1.style.marginLeft = '2000';
        const trade = data[key];	//https://chat.openai.com/c/8da5c4d2-3b57-45f1-8087-289ff3257add, how to get a trade object from a map returned from http servlet java containing trade objects given the key
        const box = document.createElement('div');
        console.log("key = " + key);
        box.id = key;
        box.className = 'portfolio-box';
        const header = document.createElement('div');
        header.className = 'portfolio-header';
        header.textContent = `${trade.ticker} - ${trade.companyName}`;
        const content = document.createElement('div');
        content.className = 'portfolio-content';
        const leftColumn = document.createElement('div');
        leftColumn.className = 'left-column';
        leftColumn.style.textAlign = 'left';
        leftColumn.style.marginLeft = '70px';
        const quantityPara = document.createElement('p');
        quantityPara.id = "quantity" + key; 
        quantityPara.textContent = `Quantity:`;
        const test = document.createElement('p');
        test.textContent = `${trade.quantity}`;
        test.id = "q" + key;
        vals1.appendChild(test); 
        leftColumn.appendChild(quantityPara); 
        const avgCostPara = document.createElement('p');
        const costPerShare = trade.totalCost / trade.quantity;
        avgCostPara.id = "avg" + key; 
        avgCostPara.textContent = `Avg. Cost / Share: `;
        leftColumn.appendChild(avgCostPara);
        const a = document.createElement('p');
        a.textContent = `$${costPerShare.toFixed(2)}`;
        a.id = "a" + key;
        vals1.appendChild(a); 
        const totalCostPara = document.createElement('p');
        totalCostPara.id = "totalCost" + key;
        totalCostPara.textContent = `Total Cost:`;
        const tc = document.createElement('p');
        tc.textContent = `$${trade.totalCost.toFixed(2)}`;
        tc.id = "t" +key;
        vals1.appendChild(tc); 
        const tick = trade.ticker;
        var change;
        var cp;
        var marketValue;
        leftColumn.appendChild(totalCostPara);
        const rightColumn = document.createElement('div');
        rightColumn.className = 'right-column';
        rightColumn.style.textAlign = 'left';
        rightColumn.style.marginRight = '200px';
        
        
        const last = document.createElement('div');
        last.style.marginRight = '100px';
        rightColumn.className = 'last-column';
        rightColumn.style.textAlign = 'left';
        rightColumn.style.marginLeft = '400px';
        
        const changePara = document.createElement('p');
        const currentPrice = document.createElement('p');
        const marketVal = document.createElement('p');
        
        
        const c = document.createElement('p');
        const current = document.createElement('p');
        const mv = document.createElement('p');
        
       	fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getStockData?symbol=' + tick) 
		.then(response => response.json())
		.then(data => {
		    console.log(data);
		    cp = data.quote.c;
		    change = data.quote.d;
		    console.log("change = " + change);
		    marketValue = trade.quantity * cp;
		    
		    https://chat.openai.com/c/910952b6-d97a-4fb8-9ccf-035d12932f77, how to assign css color based on variable
		    const colorClass = change > 0 ? 'green' : change < 0 ? 'red' : 'black';
		    const arrowIcon = change > 0 ? 'fa-caret-up' : change < 0 ? 'fa-caret-down' : '';
		    
		    changePara.textContent = `Change:`;
		    c.innerHTML = `<span class="${colorClass}"><i class="fas ${arrowIcon}"></i> $${change.toFixed(2)}</span>`;
		    currentPrice.textContent = `Current Price:`;
		    current.textContent = '$' + cp.toFixed(2);
		    marketVal.id = "marketVal"+key;
		    marketVal.textContent = `Market Value:`;
		    mv.textContent = '$' + marketValue.toFixed(2);
		    mv.id = "m" + key;
		    const footer = document.createElement('div');
	        footer.className = 'portfolio-footer';
	        console.log("cp = " + cp);
	        footer.appendChild(createTradeForm(trade.ticker, trade.quantity, cp, trade.totalCost));
	        box.appendChild(header);
	        box.appendChild(content);
	        box.appendChild(footer);
	        container.appendChild(box);
		    
		})
		
		last.appendChild(c);
		last.appendChild(current);
		last.appendChild(mv);
		
		rightColumn.appendChild(changePara);
		rightColumn.appendChild(currentPrice);
		rightColumn.appendChild(marketVal);
		
        content.appendChild(leftColumn);
        content.appendChild(vals1);
        content.appendChild(rightColumn);   
        content.appendChild(last);  
    });
}

function createParagraph(text) 
{
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
}



function createTradeForm(ticker, quantity, sharePrice, totalCost) 
{
    const form = document.createElement('form');
    form.className = 'trade-form';

    const quantityDiv = document.createElement('div');
    quantityDiv.appendChild(createInputDiv('Quantity:', 'number', 'quantity-input-' + ticker));
    form.appendChild(quantityDiv);

    const tradeTypeDiv = document.createElement('div');
    tradeTypeDiv.appendChild(createRadioGroup(ticker));
    form.appendChild(tradeTypeDiv);

    const submitButtonDiv = document.createElement('div');
    const submitButton = createSubmitButton();
    submitButtonDiv.appendChild(submitButton);
    form.appendChild(submitButtonDiv);
    
    form.onsubmit = function(event) 
    {
        event.preventDefault();  
        executeTrade(ticker, quantity, sharePrice, totalCost);  
    };

    return form;
}

function updateDB(cost, quantity, ticker, id)
{
	fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getStockData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cost: cost, quantity: quantity, ticker: ticker, id: id})
    })
    .then(()=> {
		//clearPortfolioBoxes();
		getAccountValue();
    })
    .then(()=> {
    	//fetchPortfolioData(true);
    })
}

function executeTrade(ticker, quantity, sharePrice, totalCost)
{

	var updatedQuantity = document.getElementById("q"+ticker).textContent;
	if (document.getElementById("q"+ticker)) console.log("EXISTS" + updatedQuantity);
	else console.log("NOˇ EXIST");
	console.log("UPDATED QUANTITY = " + updatedQuantity);
	quantity = Number(updatedQuantity);
	console.log("CHECK: " + document.getElementById("t"+ticker).textContent);
	totalCost =  Number(document.getElementById("t"+ticker).textContent.substring(1));
	
	
	
	if (document.querySelector(`input[name='tradeType-${ticker}']:checked`) == null || document.getElementById('quantity-input-' + ticker) == null ||document.getElementById("quantity"+ticker) == null){
		alert("TRANSACTION FAILED");
		return;
	}
	const transactionQuantity = document.getElementById('quantity-input-' + ticker).value;
	const transactionType = document.querySelector(`input[name='tradeType-${ticker}']:checked`).value;
	const cashBalance = getBalanceFromLocalStorage();
	console.log("bal = " + cashBalance);
	
	if (transactionType == 'sell')
	{
		const existingQuantity = quantity;
		if (transactionQuantity > quantity)
		{
			alert("Error: You only have " + existingQuantity + " shares so you cannot sell " + transactionQuantity + " shares.");
			return;
		}
		else
		{
			const user = JSON.parse(localStorage.getItem('user')) || {};
			const transactionCost = transactionQuantity * sharePrice;
            user.balance = user.balance + transactionCost;
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
            const q = -1 * transactionQuantity;
            const cost = -1 * transactionCost;
            updateDB(cost, q, ticker, user.id);
            updateBalanceDisplay();
            
            var element = document.getElementById("q" + ticker);
            const val = (existingQuantity + q);
            console.log("value = " + val);
    		element.textContent = val;
    		//element.id = "quantity";
    		var element = document.getElementById("a" + ticker);
    		const avg = ((cost + totalCost) / (existingQuantity + q)).toFixed(2);
    		element.textContent = "$" + avg;
    		//element.id = "avg";
    		var element = document.getElementById("t"+ticker);
    		element.textContent = "$" + (totalCost + cost).toFixed(2);
    		//element.id = "totalCost";
			var element = document.getElementById("m"+ticker);	
    		element.textContent = "$" + (sharePrice*(existingQuantity + q)).toFixed(2);
    		//element.id = "marketVal";
            
            alert("TRANSACTION SUCCESS: Sold " + transactionQuantity + " shares of " + ticker);
		    
		    setupLogoutLink();
		    
		    if (val == 0)
		    {
				var element = document.getElementById(ticker);
				element.innerHTML = "";
			}
		    
		}
	}
	if (transactionType == 'buy')
	{
		console.log("tyoe = " + transactionType);
		const transactionCost = transactionQuantity * sharePrice;
		console.log("price = " + sharePrice);
		if (transactionCost > cashBalance)
		{
			alert("Error: You do not have sufficient cash balance for this transaction. Your cash balance = " + cashBalance + " . Transaction Cost = " + transactionCost);
			return;
		}
		else
		{
			const user = JSON.parse(localStorage.getItem('user')) || {};
			const transactionCost = transactionQuantity * sharePrice;
            user.balance = user.balance - transactionCost;
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
            updateDB(transactionCost, transactionQuantity, ticker, user.id);
            updateBalanceDisplay();
		    
		    setupLogoutLink();    
		    
		    var element = document.getElementById("q"+ticker);
		    console.log(quantity);
            const val = Number(quantity) + Number(transactionQuantity);
            console.log("value = " + val);
    		element.textContent = val;
    		//element.id = "quantity";
    		var element = document.getElementById("a"+ticker);
    		const avg = ((transactionCost + totalCost) / (val)).toFixed(2);
    		element.textContent = "$" +avg;
    		//element.id = "avg";
    		var element = document.getElementById("t"+ticker);
    		element.textContent = "$" +(totalCost + transactionCost).toFixed(2);
    		//element.id = "totalCost";
    		var element = document.getElementById("m"+ticker);	
    		element.textContent = "$" + (sharePrice*(val)).toFixed(2);
    		//element.id = "marketVal";
		    fetchPortfolioData(false, false);
		    alert("TRANSACTION SUCCESS: Purchased " + transactionQuantity + " shares of " + ticker);
		}
	}
	
	fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getStockData?symbol=' + ticker) 
		.then(response => response.json())
		.then(response => response.json())
			.then(data => {
			document.getElementById('p'+ticker).textContent = '$' + data.quote.c.toFixed(2);
	})
}

function createInputDiv(labelText, inputType, inputId) 
{
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = inputId;

    const input = document.createElement('input');
    input.type = inputType;
    input.id = inputId;
    input.name = inputId;
    input.min = "1";  

    div.appendChild(label);
    div.appendChild(input);
    return div;
}

function createRadioGroup(ticker) 
{
    const div = document.createElement('div');
    div.className = 'radio-group';  
    div.style.display = 'flex';         
    div.style.flexDirection = 'row';    
    div.style.alignItems = 'center';    
    div.style.gap = '10px';             
    div.appendChild(createRadioButton('buy', 'BUY', ticker, 1));
    div.appendChild(createRadioButton('sell', 'SELL', ticker, 2));

    return div;
}

function createRadioButton(value, text, ticker, num) {
    const wrapper = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = `${value}-${ticker}`;
    input.name = `tradeType-${ticker}`;
    input.value = value;

    const label = document.createElement('label');
    label.htmlFor = `${value}-${ticker}`;
    label.textContent = text;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    if (num == 1) wrapper.style.marginLeft = '400px';
    else wrapper.style.marginRight = '400px';
    return wrapper;
}


function createSubmitButton() 
{
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit';
    button.style.width = '200px'; 
    button.style.border = '2px solid black'; 
    button.style.backgroundColor = 'lightgrey';
    button.style.height = '30px';
    return button;
}

function getUserIdFromLocalStorage() 
{
    const userString = localStorage.getItem('user');
    if (userString) 
    {
        const userObject = JSON.parse(userString);
        return userObject.id; 
    }
    return null; 
}

function getAccountValue()
{
	const userId = getUserIdFromLocalStorage();
	if (userId == null) return;
	console.log("user id = " + userId);
	fetch(`http://localhost:8080/mzestrin_CSCI201_Assignment4-new/getUserStocks?id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
       	const totalStockValue = parseFloat(data);
        const cashBalance = parseFloat(getBalanceFromLocalStorage());
        console.log("cash = " + cashBalance + " stock = " + totalStockValue);
        console.log("account val = " + totalStockValue + cashBalance);
        displayAccountValue(Number(totalStockValue) + Number(cashBalance));
    })
}

function displayAccountValue(data) 
{
	console.log(data);
    var accountValueDisplay = document.getElementById('totalAccountValue');
    if (data && !isNaN(data)) accountValueDisplay.textContent = `$${parseFloat(data).toFixed(2)}`;
    else accountValueDisplay.textContent = 'Error retrieving data';
}

