<svelte:head>
  <title>About - GoalGamble</title>
</svelte:head>

<div class="about-container"> <!-- About sida som handlar om projektet och mig -->
  <div class="content-section"> 
    <div class="about-card creator">
      <h2>About the Creator</h2>
      <div class="creator-content">
        <div class="creator-info">
          <p class="description">
            Hi! I'm Emrik, I'm an high-school student from Sweden trying to learn coding
          </p>
        </div>
      </div>
    </div>

    <div class="about-card project">
      <h2>About the Project</h2>
      <ul class="tech-stack">
        <li>
          <span class="tech-name">SvelteKit</span>
          <span class="tech-description">for a fast, efficient frontend</span>
        </li>
        <li>
          <span class="tech-name">Supabase</span>
          <span class="tech-description">for secure user authentication and data storage</span>
        </li>
        <li>
          <span class="tech-name">Betting games</span>
          <span class="tech-description">fun betting games for your entertainment</span>
        </li>
      </ul>
    </div>

    <div class="about-card contact">
      <h2>Get in Touch</h2>
      <p class="description">
        Have questions, suggestions, or just want to connect? Feel free to reach out!
      </p>
      <div class="contact-info">
        <a href="mailto:emrik.rellmar@gmail.com" class="contact-link">
          emrik.rellmar@gmail.com
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .content-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .about-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .about-card h2 {
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .creator-content {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .description {
    color: #4b5563;
    line-height: 1.6;
  }

  .tech-stack {
    list-style: none;
    padding: 0;
  }

  .tech-stack li {
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .tech-name {
    font-weight: 600;
    color: #3b82f6;
  }

  .tech-description {
    color: #64748b;
    font-size: 0.9rem;
  }

  .contact-info {
    margin-top: 1rem;
  }

  .contact-link {
    display: inline-block;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .contact-link:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .creator-content {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .about-card {
      padding: 1.5rem;
    }
  }
</style>