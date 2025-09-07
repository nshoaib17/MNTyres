// Login page functionality
(() => {
  // Storage key for login status
  const LOGIN_STATUS_KEY = 'MNTyres.loginStatus';

  // Authentication function
  function authenticate(username, password) {
    // Simple authentication - in production, this would be server-side
    return username === 'admin' && password === 'admin';
  }

  // Handle login form submission
  function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const errorElement = document.getElementById('login-error');
    
    if (authenticate(username, password)) {
      // Login successful - save login status and redirect
      localStorage.setItem(LOGIN_STATUS_KEY, 'true');
      errorElement.style.display = 'none';
      
      // Redirect to main application
      window.location.href = 'index.html';
    } else {
      // Login failed - show error message
      errorElement.style.display = 'block';
      // Clear password field
      document.getElementById('password').value = '';
    }
  }

  // Initialize login page
  function init() {
    // Check if user is already logged in
    if (localStorage.getItem(LOGIN_STATUS_KEY) === 'true') {
      // Redirect to main app if already logged in
      window.location.href = 'index.html';
      return;
    }

    // Add event listener for login form
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
