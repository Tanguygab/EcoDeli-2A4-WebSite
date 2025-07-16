import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/404.vue'
import Profile from '@/views/Profile.vue'
import { startSession } from '@/stores/session'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/',  component: Home },
        { path: '/login', component: () => import('@/views/auth/Login.vue') },
        { path: '/register', component: () => import('@/views/auth/Register.vue') },
        { path: '/profile', component: Profile },
        { path: '/profile/:id', component: Profile },
        { path: '/notifications', component: () => import('@/views/Notifications.vue') },
        { path: '/settings', component: () => import('@/views/Settings.vue') },
        { path: '/products', component: () => import('@/views/products/Products.vue') },
        { path: '/product/:id', component: () => import('@/views/products/Product.vue') },
        { path: '/requests', component: () => import('@/views/requests/Requests.vue') },
        { path: '/requests/:id', component: () => import('@/views/requests/Request.vue') },
        { path: '/services', component: () => import('@/views/services/Services.vue') },
        { path: '/services/:id', component: () => import('@/views/services/Service.vue') },
        { path: '/my-files', component: () => import('@/views/MyFiles.vue') },
        { path: '/my-products', component: () => import('@/views/MyProducts.vue') },
        { path: '/planning', component: () => import('@/views/Planning.vue') },
        { path: '/contact', component: () => import('@/views/contact.vue') },
        {
            path: '/backoffice',
            component: () => import('@/views/backoffice/Home.vue'),
            meta: { requiresAdmin: true },
            children: [
                { path: 'ssh', component: () => import('@/views/backoffice/SSH.vue'), meta: { requiresAdmin: true } },
                { path: 'users', component: () => import('@/views/backoffice/Users.vue'), meta: { requiresAdmin: true } },
                { path: 'traders', component: () => import('@/views/backoffice/Traders.vue'), meta: { requiresAdmin: true } },
                { path: 'contracts', component: () => import('@/views/backoffice/Contracts.vue'), meta: { requiresAdmin: true } },
                { path: 'candidature', component: () => import('@/views/backoffice/DeliveryMen.vue'), meta: { requiresAdmin: true } },
                { path: 'prestataires', component: () => import('@/views/backoffice/Prestataires.vue'), meta: { requiresAdmin: true } },
                { path: 'deliveries', component: () => import('@/views/backoffice/Deliveries.vue'), meta: { requiresAdmin: true } },
                { path: 'prestations', component: () => import('@/views/backoffice/Prestations.vue'), meta: { requiresAdmin: true } },
                { path: 'payments', component: () => import('@/views/backoffice/Payments.vue'), meta: { requiresAdmin: true } },
                { path: 'bills', component: () => import('@/views/backoffice/Bills.vue'), meta: { requiresAdmin: true } },
                { path: 'follow-ups', component: () => import('@/views/backoffice/Prestations.vue'), meta: { requiresAdmin: true } },
                { path: 'finance', component: () => import('@/views/backoffice/Finances.vue'), meta: { requiresAdmin: true } }
            ]
        },
        {
            path: '/deliverymen',
            component: () => import('@/views/deliverymen/Home.vue'),
            children: [
                { path: 'deliveries', component: () => import('@/views/deliverymen/Deliveries.vue') },
                { path: 'deliveries/:id', component: () => import('@/views/deliverymen/Delivery.vue') },
                { path: 'requests', component: () => import('@/views/deliverymen/Requests.vue') },
                { path: 'form', component: () => import('@/views/deliverymen/JoinForm.vue') },
            ]
        },
        { path: '/client/annonce', component: () => import('@/views/client/ClientAnnonces.vue') },
        { path: '/client/box', component: () => import('@/views/client/ClientBox.vue') },
        { path: '/access-denied', component: () => import('@/views/AccessDenied.vue') },
        { path: '/:pathMatch(.*)*', component: NotFound }
    ]
})

// Guard de navigation pour protéger les routes admin
router.beforeEach((to, from, next) => {
    // Vérifier si la route nécessite les droits admin
    if (to.meta.requiresAdmin) {
        const session = startSession()
        
        // Vérifier si l'utilisateur est connecté
        if (!session.user || !session.token) {
            // Rediriger vers la page de connexion si non connecté
            next('/login')
            return
        }
        
        // Vérifier si l'utilisateur a le rôle admin (access_level = 0)
        if (session.user.role.access_level !== 0) {
            // Rediriger vers la page d'accès refusé si pas admin
            next('/access-denied')
            return
        }
    }
    
    // Continuer la navigation si tout est ok
    next()
})

export default router
