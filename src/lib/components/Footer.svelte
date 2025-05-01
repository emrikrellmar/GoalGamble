<script>
    const currentYear = new Date().getFullYear();
</script>
  
  <footer>
    <div class="footer-content">
      <p>© {currentYear} GoalGamble - Emrik Rellmar</p>
      <div class="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <span class="divider">|</span>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </footer>
  
  <style>
    footer {
      background: white;
      border-top: 1px solid #e2e8f0;
      padding: 2rem 1rem;
      margin-top: auto;
    }
  
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #64748b;
    }
  
    .footer-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
  
    .footer-links a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;
      font-size: 0.9rem;
    }
  
    .footer-links a:hover {
      color: #334155;
      text-decoration: underline;
    }
  
    .divider {
      color: #cbd5e1;
      font-size: 0.9rem;
    }
  
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
  
      .footer-links {
        justify-content: center;
      }
    }
  </style>