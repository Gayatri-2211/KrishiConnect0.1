async function registerUser(userType) {
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        userType: userType
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('email', user.email);

        alert('✅ Registration successful!');
        redirectToHome();
    } catch (error) {
        console.error('❌ Registration Error:', error);
       
    }
}

async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('email', email);

        redirectToHome();
    } catch (error) {
        console.error('❌ Login Error:', error);
        alert(error.message);
    }
}

// Ensure buttons are connected properly
document.getElementById("signupForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    const userType = event.submitter.id === 'buyerBtn' ? 'buyer' : 'seller';
    registerUser(userType);
});

document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();
    loginUser();
});

// ✅ Fetch User Profile
async function fetchUserProfile() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('❌ No token found in localStorage');
        alert('❌ Session expired, please log in again');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // If token is invalid, clear storage and redirect to login
            if (response.status === 401) {
                console.error('❌ Unauthorized. Clearing token.');
                localStorage.clear();
                alert('❌ Session expired, please log in again');
                window.location.href = 'login.html';
                return;
            } 
            throw new Error('Failed to fetch profile');
        }

        const user = await response.json();
        console.log('✅ Fetched user:', user);

        // ✅ Store user details for use in profile.html
        localStorage.setItem('name', user.name);
        localStorage.setItem('email', user.email);
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('userType', user.userType);

        updateProfilePage(); // Call function to display profile info
    } catch (error) {
        console.error('❌ Profile Error:', error);
        alert('❌ Failed to fetch profile. Try again later.');
    }
}

console.log('Token:', localStorage.getItem('token'));
// ✅ Update Navigation Based on User Type
function updateNavigation(userType) {
    const nav = document.getElementById('nav');
    nav.innerHTML = ''; // ✅ Clear existing navigation

    const home = `<a href="home.html">Home</a>`;
    const profile = `<a href="profile.html">Profile</a>`;
    const logout = `<a href="#" onclick="logoutUser()">Logout</a>`;

    if (userType === 'buyer') {
        nav.innerHTML = `
            ${home}
            <a href="marketplace.html">Marketplace</a>
            <a href="farmingAdvice.html">Farming Advice</a>
            <a href="marketPrices.html">Market Prices</a>
            <a href="buy.html">Buy</a>
            <a href="orders.html">Your Orders</a>
            <a href="cart.html">Cart</a>
            ${profile}
            ${logout}
        `;
    } else if (userType === 'seller') {
        nav.innerHTML = `
            ${home}
            <a href="marketplace.html">Marketplace</a>
            <a href="farmingAdvice.html">Farming Advice</a>
            <a href="marketPrices.html">Market Prices</a>
            <a href="sell.html">Sell</a>
            ${profile}
            ${logout}
        `;
    }
}

// ✅ Redirect to Correct Home Page
function redirectToHome() {
    const userType = localStorage.getItem('userType');

    if (userType === 'buyer') {
        window.location.href = 'buyerHome.html';
    } else if (userType === 'seller') {
        window.location.href = 'sellerHome.html';
    }
}

// ✅ Logout User
function logoutUser() {
    localStorage.clear();
    alert('✅ Logout successful');
    window.location.href = 'login.html';
}

// ✅ Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let userType = localStorage.getItem('userType');

    if (token) {
        fetchUserProfile(); // ✅ Load user profile
        if (window.location.pathname === '/index.html') {
            redirectToHome();
        }
    }
});
function updateProfilePage() {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const phone = localStorage.getItem('phone');
    const userType = localStorage.getItem('userType');

    // ✅ Ensure elements exist before setting values
    if (document.getElementById('profile-name')) {
        document.getElementById('profile-name').innerText = name || 'N/A';
        document.getElementById('profile-email').innerText = email || 'N/A';
        document.getElementById('profile-phone').innerText = phone || 'N/A';
        document.getElementById('profile-role').innerText = userType || 'N/A';
    }
}
// document.getElementById("signupForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent default submission

//     const phone = document.getElementById("phone").value;
//     const phonePattern = /^[0-9]{10}$/;

//     if (!phonePattern.test(phone)) {
//         alert("Please enter a valid 10-digit phone number");
//         return; // ✅ Stop execution if validation fails
//     }

//     // ✅ Detect which button was clicked using event.submitter
//     const userType = event.submitter.id === 'buyerBtn' ? 'buyer' : 'seller';
//     registerUser(userType);
// });
// document.getElementById("loginForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent default submission
//     loginUser();
// }
// );

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    // ✅ Phone validation
    if (!phonePattern.test(phone)) {
        alert("❌ Please enter a valid 10-digit phone number");
        return;
    }

    // ✅ Email validation
    if (!emailPattern.test(email)) {
        alert("❌ Please enter a valid email address");
        return;
    }

    // ✅ Password validation
    if (!passwordPattern.test(password)) {
        alert("❌ Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character");
        return;
    }

    // ✅ Detect which button was clicked
    const userType = event.submitter.id === 'buyerBtn' ? 'buyer' : 'seller';
    registerUser(userType);
});




