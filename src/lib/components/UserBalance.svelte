<script>
    import { user } from '$lib/stores/user';
  </script>
  
  <div class="user-balance">
    <p>Your Balance: {$user.balance.toFixed(2)} coins</p>
  </div>
  
  <style>
    .user-balance {
      background: #f4f4f4;
      padding: 0.5rem;
      border-radius: 4px;
      text-align: right;
    }
  </style>