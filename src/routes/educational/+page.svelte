<svelte:head>
  <title>Educational - GoalGamble</title>
</svelte:head>

<script>
    let activeTab = 'tips';
    let showAllFAQs = false;
    
    const faqs = [
      {
        question: "How can I keep my gambling habits healthy?",
        answer: "Set strict time and credit limits, take regular breaks, and never chase losses. Remember that gambling should be entertaining, not a way to make money."
      },
      {
        question: "What are signs of problematic gambling?",
        answer: "Signs include spending more time/credits than planned, neglecting other activities, lying about gambling habits, and feeling stressed about gambling activities."
      },
      {
        question: "How can I set limits on my betting?",
        answer: "Use our built-in tools to set daily/weekly credit limits, time restrictions, and get regular activity reports to track your betting patterns."
      },
      {
        question: "What should I do if I'm concerned about my gambling?",
        answer: "Take our self-assessment test, talk to friends/family, and consider taking a break. Remember, even though GoalGamble uses virtual credits, developing good habits is important."
      }
    ];
  
    const assessmentQuestions = [
      "Do you spend more time gambling than initially planned?",
      "Do you often try to win back lost bets?",
      "Does gambling interfere with your daily responsibilities?",
      "Do you feel stressed or anxious about your gambling habits?",
      "Have you tried to cut down on gambling but couldn't?"
    ];
  
    function setActiveTab(tab) {
      activeTab = tab;
    }
  
    function toggleFAQs() {
      showAllFAQs = !showAllFAQs;
    }
  </script>
  
  <div class="responsible-gambling">
  
    <div class="nav-tabs">
      <button 
        class="tab-button {activeTab === 'tips' ? 'active' : ''}"
        on:click={() => setActiveTab('tips')}>
        Tips
      </button>
      <button 
        class="tab-button {activeTab === 'assessment' ? 'active' : ''}"
        on:click={() => setActiveTab('assessment')}>
        Self-Assessment
      </button>
      <button 
        class="tab-button {activeTab === 'faq' ? 'active' : ''}"
        on:click={() => setActiveTab('faq')}>
        FAQ
      </button>
    </div>
  
    <div class="content-section">  
      {#if activeTab === 'tips'}
        <div class="tab-content">
          <div class="tips-section">
            <h2>Responsible Gambling Tips</h2>
            
            <div class="tip-cards">
              <div class="tip-card">
                <h3>Before You Bet</h3>
                <ul>
                  <li>Set a clear credit limit</li>
                  <li>Decide on a time limit</li>
                  <li>Never bet credits you can't afford to lose</li>
                  <li>Understand the odds and rules</li>
                </ul>
              </div>
  
              <div class="tip-card">
                <h3>While Betting</h3>
                <ul>
                  <li>Take regular breaks</li>
                  <li>Don't chase losses</li>
                  <li>Keep track of time spent</li>
                  <li>Stay within your limits</li>
                </ul>
              </div>
  
              <div class="tip-card">
                <h3>Healthy Habits</h3>
                <ul>
                  <li>Balance with other activities</li>
                  <li>Practice mindful betting</li>
                  <li>Use our tracking tools</li>
                  <li>Learn from experiences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  
      {:else if activeTab === 'assessment'}
        <div class="tab-content">
          <div class="assessment-section">
            <h2>Self-Assessment Checklist</h2>
            <p class="assessment-intro">
              Regular self-assessment helps maintain healthy gambling habits. Consider these questions about your gambling behavior:
            </p>
  
            <div class="assessment-questions">
              {#each assessmentQuestions as question, i}
                <div class="question-item">
                  <span class="question-number">{i + 1}</span>
                  <p>{question}</p>
                  <div class="answer-options">
                    <label>
                      <input type="radio" name="q{i}" value="yes">
                      Yes
                    </label>
                    <label>
                      <input type="radio" name="q{i}" value="no">
                      No
                    </label>
                  </div>
                </div>
              {/each}
            </div>
  
            <div class="assessment-note">
              <p>
                If you answered "Yes" to two or more questions, consider taking a break and reviewing your gambling habits.
                Remember, developing good habits with virtual credits can prevent problems with real gambling in the future.
              </p>
            </div>
          </div>
        </div>
  
      {:else if activeTab === 'faq'}
        <div class="tab-content">
          <div class="faq-section">
            <h2>Frequently Asked Questions</h2>
            
            <div class="faq-list">
              {#each faqs.slice(0, showAllFAQs ? faqs.length : 3) as faq}
                <div class="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              {/each}
            </div>
  
            {#if faqs.length > 3}
              <button class="show-more-btn" on:click={toggleFAQs}>
                {showAllFAQs ? 'Show Less' : 'Show More'}
              </button>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  
    <div class="help-section">
        <h2>Need Help?</h2>
        <p>
          If you're concerned about your gambling habits, even with virtual credits,
          we encourage you to talk to someone. 
        </p>
        <div class="help-links">
          <a 
            href="https://findahelpline.com/organizations/stodlinjen-for-spelare-och-anhoriga-the-swedish-national-gambling-helpline" 
            class="help-link"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Get help
          </a>
        </div>
      </div>
  </div>
  
  <style>
    .responsible-gambling {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  
    .nav-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      -webkit-overflow-scrolling: touch;
    }
  
    .tab-button {
      padding: 0.75rem 1.5rem;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
  
    .tab-button:hover {
      background: #e2e8f0;
      color: #1e293b;
    }
  
    .tab-button.active {
      background: #3b82f6;
      color: white;
    }
  
    .content-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  
    .tips-section {
      margin-bottom: 3rem;
    }
  
    .tips-section h2 {
      color: #1e293b;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
  
    .tip-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
  
    .tip-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.75rem;
      transition: transform 0.2s ease;
    }
  
    .tip-card:hover {
      transform: translateY(-2px);
    }
  
    .tip-card h3 {
      color: #3b82f6;
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  
    .tip-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    .tip-card li {
      margin-bottom: 0.75rem;
      padding-left: 1.5rem;
      position: relative;
      color: #64748b;
    }
  
    .tip-card li:before {
      content: "•";
      color: #3b82f6;
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  
    .assessment-section {
      padding: 1rem;
    }
  
    .assessment-intro {
      color: #64748b;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
  
    .assessment-questions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
  
    .question-item {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  
    .question-number {
      background: #3b82f6;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      flex-shrink: 0;
    }
  
    .question-item p {
      color: #1e293b;
      flex-grow: 1;
    }
  
    .answer-options {
      display: flex;
      gap: 1.5rem;
    }
  
    .answer-options label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      cursor: pointer;
    }
  
    .assessment-note {
      background: #eff6ff;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-top: 2rem;
    }
  
    .assessment-note p {
      color: #1e40af;
      line-height: 1.6;
    }
  
    .faq-section h2 {
      color: #1e293b;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }
  
    .faq-item {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
    }
  
    .faq-item h3 {
      color: #3b82f6;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
  
    .faq-item p {
      color: #64748b;
      line-height: 1.6;
    }
  
    .show-more-btn {
      display: block;
      margin: 2rem auto;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
  
    .show-more-btn:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  
    .help-section {
      margin-top: 3rem;
      padding: 2rem;
      background: #eff6ff;
      border-radius: 1rem;
      text-align: center;
    }
  
    .help-section h2 {
      color: #1e293b;
      margin-bottom: 1rem;
    }
  
    .help-section p {
      color: #64748b;
      max-width: 600px;
      margin: 0 auto 1.5rem;
      line-height: 1.6;
    }
  
    .help-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  
    .help-link {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }
  
    .help-link:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  
    /* Responsive Styles */
    @media (max-width: 768px) {
      .responsible-gambling {
        padding: 1rem;
      }
  
      .nav-tabs {
        padding-bottom: 0.25rem;
      }
  
      .tab-button {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
  
      .content-section {
        padding: 1.5rem;
      }
  
      .tip-cards {
        grid-template-columns: 1fr;
      }
  
      .question-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
  
      .answer-options {
        margin-left: 2.5rem;
      }
    }
  
    @media (max-width: 480px) {  
      .help-links {
        flex-direction: column;
      }
  
      .content-section {
        padding: 1rem;
      }
  
      .tip-card {
        padding: 1.25rem;
      }
    }
  </style>