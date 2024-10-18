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
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      position: relative;
    }
  
    .logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  
    .logo h1 {
      font-size: 3rem;
      font-weight: bold;
      color: #333;
      margin: 0;
      white-space: nowrap;
    }
  
    nav {
      margin-left: auto;
    }
  
    .nav-links {
      list-style-type: none;
      padding: 0;
      display: flex;
      margin: 1;
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
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      margin-left: 1rem;
    }
  
    .bar {
      display: block;
      width: 25px;
      height: 3px;
      margin: 5px auto;
      background-color: #333;
    }
  
    @media (max-width: 768px) {
      .container {
        justify-content: flex-end;
      }
  
      .logo {
        position: static;
        transform: none;
        margin-right: auto;
      }
  
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
        padding: 0.2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
  
      nav.active .nav-links li {
        margin: 0.5rem 0;
      }
  
      .menu-toggle {
        display: block;
        padding-right: 1rem;
      }
    }
  </style>