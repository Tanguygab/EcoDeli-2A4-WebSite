import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/404.vue'
import Profile from '@/views/Profile.vue'

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
            children: [
                { path: 'ssh', component: () => import('@/views/backoffice/SSH.vue') },
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
        },
        {
            path: '/deliverymen',
            component: () => import('@/views/deliverymen/Home.vue'),
            children: [
                { path: 'deliveries', component: () => import('@/views/deliverymen/Deliveries.vue') },
                { path: 'deliveries/:id', component: () => import('@/views/deliverymen/Delivery.vue') },
                { path: 'form', component: () => import('@/views/deliverymen/LivrForm.vue') },
            ]
        },
        { path: '/client/annonce', component: () => import('@/views/client/ClientAnnonceForm.vue') },
        { path: '/client/box', component: () => import('@/views/client/ClientBox.vue') },
        { path: '/:pathMatch(.*)*', component: NotFound }
    ]
})

export default router
