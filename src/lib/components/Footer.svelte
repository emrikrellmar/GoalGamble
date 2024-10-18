<script>
    const currentYear = new Date().getFullYear();
  </script>
  
  <footer class="footer">
    <div class="container">
      <div class="copyright">
        <p>&copy; {currentYear} GoalGamble. All rights reserved.</p>
      </div>
      <nav>
        <ul class="nav-links">
          <li><a href="/about">About me</a></li>
          <li><a href="/privacy"> My project </a></li>
          <li><a href="/contact">Contact me</a></li>
        </ul>
      </nav>
    </div>
  </footer>
  
  <style>
    .footer {
      background-color: #f4f4f4;
      color: #000000;
      padding: 2rem 0;
      margin-top: 2rem;
    }
  
    .container {
      width: 90%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .copyright {
      margin-bottom: 1rem;
      text-align: center;
    }
  
    .nav-links {
      list-style-type: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  
    .nav-links li {
      margin: 0.5rem 1rem;
    }
  
    .nav-links a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }
  
    .nav-links a:hover {
      color: #63b3ed;
    }
  
    @media (min-width: 768px) {
      .container {
        flex-direction: row;
        justify-content: space-between;
      }
  
      .copyright {
        margin-bottom: 0;
      }
  
      .nav-links {
        justify-content: flex-end;
      }
  
      .nav-links li {
        margin: 0 0 0 2rem;
      }
    }
  </style>