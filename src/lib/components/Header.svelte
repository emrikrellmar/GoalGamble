<script>
    let isMenuOpen = false;
  
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
    }
  </script>
  
  <header class="header">
    <div class="container">
      <div class="logo">
        <h1>GoalGamble</h1>
      </div>
      <nav class:active={isMenuOpen}>
        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/bets">Bets</a></li>
          <li><a href="/live">Live</a></li>
          <li><a href="/account">My Account</a></li>
        </ul>
      </nav>
      <button class="menu-toggle" on:click={toggleMenu}>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </header>
  
  
  <style>
    .header {
      background-color: #f4f4f4;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .container {
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 100px;
    }
  
    .logo h1 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-align: left;
      margin-left: 0;
    }
  
    .nav-links {
      list-style-type: none;
      padding-right: 30px;
      display: flex;
    }
  
    .nav-links li {
      margin-left: 1.5rem;
    }
  
    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
  
    .nav-links a:hover {
      color: #0056b3;
    }
  
    .menu-toggle {
      padding-right: 40px;
      display: none;
      background: none;
      border: none;
      cursor: pointer;
    }
  
    .bar {
      display: block;
      width: 25px;
      height: 3px;
      margin: 5px auto;
      background-color: #333;
    }
  
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
  
      nav.active .nav-links {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #f4f4f4;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
  
      nav.active .nav-links li {
        margin: 0.5rem 0;
      }
  
      .menu-toggle {
        display: block;
      }
    }
  </style>