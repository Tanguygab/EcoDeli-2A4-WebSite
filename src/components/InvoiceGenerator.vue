<script setup lang="ts">
import { ref, computed } from 'vue'
import { startSession } from '@/stores/session'
import type { Product } from '@/types/product'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  customer: {
    name: string
    address: string
    city: string
    zipcode: string
    email: string
    phone: string
  }
  items: InvoiceItem[]
  paymentMethod: string
  notes: string
}

const session = startSession()
const user = session.user!!

const props = defineProps<{
  products: Product[]
  totalAmount: number
  customerInfo?: any
}>()

const invoiceData = ref<InvoiceData>({
  invoiceNumber: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  date: new Date().toLocaleDateString('fr-FR'),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
  customer: {
    name: props.customerInfo?.firstname + ' ' + props.customerInfo?.name || 'Client',
    address: props.customerInfo?.address || '[Adresse complète de l\'entreprise]',
    city: props.customerInfo?.city || '',
    zipcode: props.customerInfo?.zipcode || '',
    email: props.customerInfo?.email || '[Email de contact]',
    phone: props.customerInfo?.phone || '[Numéro de téléphone]'
  },
  items: props.products.map(product => ({
    description: product.name,
    quantity: 1,
    unitPrice: product.price,
    totalPrice: product.price
  })),
  paymentMethod: 'Virement / Carte bancaire / Espèces',
  notes: 'Pénalités de retard : 10% du montant total TTC par mois de retard.\n\n"TVA non applicable, article 293 B du CGI" (si auto-entrepreneur)'
})

const subtotal = computed(() => {
  return invoiceData.value.items.reduce((sum, item) => sum + item.totalPrice, 0)
})

const tvaRate = 0.20
const tvaAmount = computed(() => subtotal.value * tvaRate)
const totalTTC = computed(() => subtotal.value + tvaAmount.value)

function generatePDF() {
  // Cette fonction sera implémentée pour générer le PDF
  const element = document.getElementById('invoice-content')
  if (!element) return

  // Pour l'instant, on ouvre la fenêtre d'impression
  window.print()
}

function downloadPDF() {
  // Fonction pour télécharger le PDF
  generatePDF()
}
</script>

<template>
  <div class="invoice-container">
    <div class="invoice-actions">
      <button class="button is-primary" @click="generatePDF">
        <i class="fas fa-print"></i> Imprimer
      </button>
      <button class="button is-success" @click="downloadPDF">
        <i class="fas fa-download"></i> Télécharger PDF
      </button>
    </div>

    <div id="invoice-content" class="invoice-content">
      <div class="invoice-header">
        <div class="company-info">
          <h1 class="company-name">ECODELI</h1>
          <p>Adresse : [Adresse complète de l'entreprise]</p>
          <p>SIRET : [Numéro SIRET]</p>
          <p>TVA intracommunautaire : [Numéro de TVA]</p>
          <p>Email : [Email de contact]</p>
          <p>Téléphone : [Numéro de téléphone]</p>
        </div>
        <div class="invoice-logo">
          <img src="/logo.png" alt="EcoDeli Logo" class="logo" />
        </div>
      </div>

      <div class="invoice-details">
        <div class="customer-info">
          <h3>Nom du client : {{ invoiceData.customer.name }}</h3>
          <p>Adresse : {{ invoiceData.customer.address }}</p>
        </div>
        <div class="invoice-meta">
          <p><strong>Facture N° :</strong> {{ invoiceData.invoiceNumber }}</p>
        </div>
      </div>

      <div class="invoice-dates">
        <p><strong>Date d'émission :</strong> {{ invoiceData.date }}</p>
        <p><strong>Date de prestation :</strong> {{ invoiceData.dueDate }}</p>
      </div>

      <div class="invoice-items">
        <h3>Détails de la prestation / des produits :</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix unitaire HT</th>
              <th>Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in invoiceData.items" :key="item.description">
              <td>{{ item.description }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unitPrice.toFixed(2) }} €</td>
              <td>{{ item.totalPrice.toFixed(2) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-totals">
        <p><strong>Total HT :</strong> {{ subtotal.toFixed(2) }} €</p>
        <p><strong>TVA (20%) :</strong> {{ tvaAmount.toFixed(2) }} €</p>
        <p><strong>Total TTC :</strong> {{ totalTTC.toFixed(2) }} €</p>
      </div>

      <div class="payment-info">
        <h3>Modalités de paiement :</h3>
        <p>Mode de paiement : {{ invoiceData.paymentMethod }}</p>
        <p>Date d'échéance : {{ invoiceData.dueDate }}</p>
      </div>

      <div class="invoice-notes">
        <h3>Mentions légales :</h3>
        <div class="notes-content">
          <p v-for="note in invoiceData.notes.split('\n')" :key="note">{{ note }}</p>
        </div>
      </div>

      <div class="invoice-footer">
        <p>Merci pour votre confiance.</p>
        <p>[Signature]</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.invoice-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-end;
}

.invoice-content {
  background: white;
  color: black;
  padding: 40px;
  border: 1px solid #ddd;
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #09ce44;
}

.company-name {
  font-size: 2rem;
  font-weight: bold;
  color: #09ce44;
  margin-bottom: 10px;
}

.company-info p {
  margin: 5px 0;
  font-size: 14px;
}

.logo {
  max-height: 80px;
  width: auto;
}

.invoice-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.customer-info h3 {
  margin-bottom: 10px;
  color: #333;
}

.invoice-meta {
  text-align: right;
}

.invoice-dates {
  margin-bottom: 30px;
}

.invoice-items {
  margin-bottom: 30px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.items-table th,
.items-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.items-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.invoice-totals {
  text-align: right;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.invoice-totals p {
  margin: 8px 0;
  font-size: 16px;
}

.payment-info,
.invoice-notes {
  margin-bottom: 30px;
}

.payment-info h3,
.invoice-notes h3 {
  color: #333;
  margin-bottom: 10px;
}

.notes-content {
  font-size: 14px;
  color: #666;
}

.invoice-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* Styles pour l'impression */
@media print {
  .invoice-actions {
    display: none;
  }
  
  .invoice-container {
    margin: 0;
    padding: 0;
  }
  
  .invoice-content {
    border: none;
    box-shadow: none;
  }
}
</style>
