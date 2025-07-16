import { computed } from 'vue'
import { startSession } from '@/stores/session'

export function usePermissions() {
  const session = startSession()
  
  const isAdmin = computed(() => {
    return session.user && session.user.role.access_level === 0
  })
  
  const isSupport = computed(() => {
    return session.user && session.user.role.access_level === 1
  })
  
  const isHR = computed(() => {
    return session.user && session.user.role.access_level === 2
  })
  
  const isEmployee = computed(() => {
    return session.user && session.user.role.access_level === 3
  })
  
  const isSupplier = computed(() => {
    return session.user && session.user.role.access_level === 4
  })
  
  const isServiceProvider = computed(() => {
    return session.user && session.user.role.access_level === 5
  })
  
  const isDelivery = computed(() => {
    return session.user && session.user.role.access_level === 6
  })
  
  const isUser = computed(() => {
    return session.user && session.user.role.access_level === 7
  })
  
  const hasRole = (accessLevel: number) => {
    return session.user && session.user.role.access_level === accessLevel
  }
  
  const hasMinimumRole = (accessLevel: number) => {
    return session.user && session.user.role.access_level <= accessLevel
  }
  
  const canAccessBackOffice = computed(() => {
    return isAdmin.value
  })
  
  const getUserRoleName = () => {
    if (!session.user) return 'Non connecté'
    
    const roles = {
      0: 'Admin',
      1: 'Support',
      2: 'HR',
      3: 'Employee',
      4: 'Supplier',
      5: 'Service Provider',
      6: 'Delivery',
      7: 'User'
    }
    
    return roles[session.user.role.access_level as keyof typeof roles] || 'Unknown'
  }
  
  return {
    isAdmin,
    isSupport,
    isHR,
    isEmployee,
    isSupplier,
    isServiceProvider,
    isDelivery,
    isUser,
    hasRole,
    hasMinimumRole,
    canAccessBackOffice,
    getUserRoleName
  }
}
