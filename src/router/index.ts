import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: () => import('@/views/auth/Login.vue') },
    { path: '/register', component: () => import('@/views/auth/Register.vue') },
    { path: '/profile', component: Profile },
    { path: '/profile/:id', component: Profile },
    { path: '/notifications', component: () => import('@/views/Notifications.vue') },
    { path: '/settings', component: () => import('@/views/Settings.vue') },
    { path: '/products', component: () => import('@/views/products/Products.vue') },
    { path: '/product/:id', component: () => import('@/views/products/Product.vue') },
    {
      path: '/backoffice',
      component: () => import('@/views/backoffice/Home.vue'),
      children: [
        { path: 'traders', component: () => import('@/views/backoffice/Traders.vue') },
        { path: 'contracts', component: () => import('@/views/backoffice/Contracts.vue') },
        { path: 'deliverymen', component: () => import('@/views/backoffice/DeliveryMen.vue') },
        { path: 'prestataires', component: () => import('@/views/backoffice/Prestataires.vue') },
        { path: 'deliveries', component: () => import('@/views/backoffice/Deliveries.vue') },
        { path: 'prestations', component: () => import('@/views/backoffice/Prestations.vue') },
        { path: 'payments', component: () => import('@/views/backoffice/Payments.vue') },
        { path: 'bills', component: () => import('@/views/backoffice/Bills.vue') },
        { path: 'follow-ups', component: () => import('@/views/backoffice/Prestations.vue') },
        { path: 'finance', component: () => import('@/views/backoffice/Finances.vue') }
     ]
    }
  ]
})

export default router
