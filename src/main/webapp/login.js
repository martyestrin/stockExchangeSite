document.addEventListener('DOMContentLoaded', function() 
{
    const form = document.getElementById('registration-form');
    if(form)
    {
        form.addEventListener('submit', function(event) 
        {
            event.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const email = document.getElementById('signup-email').value;
            const password2 = document.getElementById('confirm-password').value;
            
            if (password !== password2) 
            {
                alert("Passwords do not match.");
                return;
            }
            
            const formData = 
            {
                username: username,
                password: password,
                password2: password2,
                email: email
            };
            
            fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/RegisterUser', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Registration successful', data);
                    //alert("Wecome " + username);
                    localStorage.setItem('user', JSON.stringify({
						password: password,
			            username: username,
			            balance: 50000,
			            isAuthenticated: true,
		    			id: data.studentID
		    		}));
                    window.location.href = 'http://localhost:8080/mzestrin_CSCI201_Assignment4-new/index.html';
                } else {
                    console.log('Registration failed', data);
                    alert("Registration failed. Username or Email is already taken.");
                }
            })
        });
    }
});


document.addEventListener('DOMContentLoaded', function() 
{
    const form = document.getElementById('login-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const formData = 
        {
            username: username,
            password: password,
        };

        fetch('http://localhost:8080/mzestrin_CSCI201_Assignment4-new/LoginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
		.then(response => response.json())
        .then(data => {
			//console.log("is data sucessful?" + data.success);
            if (data.success) {
                console.log('Registration successful', data);
                localStorage.setItem('user', JSON.stringify({
					password: password,
		            username: username,
		            balance: fetchBalance(username),
		            isAuthenticated: true,
					id: data.studentID
				}));
				//alert("Wecome " + username);
	            window.location.href = 'http://localhost:8080/mzestrin_CSCI201_Assignment4-new/index.html';
            }
            else 
            {
	            alert('Invalid username or password');
	            console.log('Invalid username or password');
            }
        })
    });
});


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





