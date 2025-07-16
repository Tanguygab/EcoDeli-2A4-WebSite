<template>
  <div class="access-denied">
    <div class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h1 class="error-title">Accès refusé</h1>
      <p class="error-message">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <p class="error-details">
        Seuls les administrateurs peuvent accéder au back office.
      </p>
      <div class="error-actions">
        <RouterLink to="/" class="btn btn-primary">
          <i class="fas fa-home"></i>
          Retour à l'accueil
        </RouterLink>
        <RouterLink to="/contact" class="btn btn-secondary">
          <i class="fas fa-envelope"></i>
          Nous contacter
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { startSession } from '@/stores/session'
import { usePermissions } from '@/composables/usePermissions'

const session = startSession()
const { getUserRoleName } = usePermissions()
</script>

<style scoped>
.access-denied {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 2rem;
}

.error-container {
  text-align: center;
  max-width: 600px;
  background: #2a2a2a;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid #444;
}

.error-icon {
  font-size: 4rem;
  color: #e74c3c;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.error-message {
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.error-details {
  font-size: 1rem;
  color: #999;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  min-width: 150px;
  justify-content: center;
}

.btn-primary {
  background: #09ce44;
  color: #fff;
}

.btn-primary:hover {
  background: #0ab33a;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #555;
  color: #fff;
}

.btn-secondary:hover {
  background: #666;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .error-container {
    padding: 2rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-message {
    font-size: 1.1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 250px;
  }
}
</style>
