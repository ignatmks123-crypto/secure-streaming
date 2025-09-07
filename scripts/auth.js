// Enhanced authentication system with registration
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Initialize users in localStorage if not exists
    if (!localStorage.getItem('users')) {
        // Create default admin user
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@securestream.com',
                password: 'password123', // In a real app, this would be hashed
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Initialize videos in localStorage if not exists
    if (!localStorage.getItem('videos')) {
        // Create some sample videos
        const sampleVideos = [
            {
                id: 1,
                title: 'Introduction to Secure Streaming',
                description: 'Learn how our platform protects your content',
                filename: 'intro.mp4',
                uploadDate: new Date().toISOString(),
                isPublic: true,
                uploadedBy: 'admin'
            },
            {
                id: 2,
                title: 'Advanced Content Protection',
                description: 'Deep dive into our security features',
                filename: 'advanced.mp4',
                uploadDate: new Date().toISOString(),
                isPublic: false,
                uploadedBy: 'admin'
            }
        ];
        localStorage.setItem('videos', JSON.stringify(sampleVideos));
    }
    
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userRole = localStorage.getItem('userRole');
        // Redirect based on user role
        if (userRole === 'admin') {
            if (!window.location.pathname.includes('dashboard.html')) {
                window.location.href = 'dashboard.html';
            }
        } else if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'videos.html';
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Authenticate user
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Store authentication status
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', user.id);
                localStorage.setItem('username', user.username);
                localStorage.setItem('userRole', user.role);
                
                // Redirect based on role
                if (user.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'videos.html';
                }
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate form
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                return;
            }
            
            if (password.length < 6) {
                errorMessage.textContent = 'Password must be at least 6 characters';
                return;
            }
            
            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.username === username)) {
                errorMessage.textContent = 'Username already exists';
                return;
            }
            
            if (users.find(u => u.email === email)) {
                errorMessage.textContent = 'Email already registered';
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                username: username,
                email: email,
                password: password, // In a real app, this would be hashed
                role: 'user',
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto-login after registration
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', newUser.id);
            localStorage.setItem('username', newUser.username);
            localStorage.setItem('userRole', newUser.role);
            
            // Redirect to videos page
            window.location.href = 'videos.html';
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }
    
    // Protect pages based on authentication
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.includes('watch.html') ||
        window.location.pathname.includes('videos.html')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }
    
    // Show/hide dashboard link based on authentication and role
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        if (localStorage.getItem('isLoggedIn') === 'true' && 
            localStorage.getItem('userRole') === 'admin') {
            dashboardLink.style.display = 'block';
        } else {
            dashboardLink.style.display = 'none';
        }
    }
    
    // Update navigation based on authentication
    updateNavigation();
});

function updateNavigation() {
    const navElements = document.querySelectorAll('nav ul');
    
    navElements.forEach(nav => {
        // Clear existing navigation
        const existingNav = nav.innerHTML;
        
        // Add appropriate links based on authentication
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const username = localStorage.getItem('username');
            const userRole = localStorage.getItem('userRole');
            
            let newNav = `
                <li><a href="index.html">Home</a></li>
                <li><a href="videos.html">Videos</a></li>
            `;
            
            if (userRole === 'admin') {
                newNav += `<li><a href="dashboard.html">Dashboard</a></li>`;
            }
            
            newNav += `
                <li><a href="#" id="logoutBtn">Logout (${username})</a></li>
            `;
            
            nav.innerHTML = newNav;
            
            // Reattach logout event listener
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userRole');
                    window.location.href = 'index.html';
                });
            }
        } else {
            nav.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            `;
        }
    });
}