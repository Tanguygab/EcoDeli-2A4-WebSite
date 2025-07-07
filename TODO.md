- Pagination
- Tour


- New Product page (role._id = 4 -> supplier)
  - name
  - price
  - description
  - image
  - location (warehouse?)


- Product page
  - Product info
  - Seller info
  - Stripe payment


- Product Requests (role._id = 6 -> deliveryman)
  - Product details
  - Accept request
  - Mark request as completed
    - Request Stripe payment

- Services (role._id = 5 -> service provider)
  - Service details
  - Accept Service
  - Mark service as completed
      - Request Stripe payment

- Planning page
  - Employee / Supplier / Service Provider
    - Set availability
    - Plan meeting
    - Meetings
  - User
    - Deliveries
    - Services


- Notifications
  - Fetch from & update through API
  - Send notifications on actions from other pages


- Settings page
  - Notifications
  - Subscription
  - Saved Locations
  - Email
  - Password reset
  - Delete account


- Sign Up as DeliveryMan / Service Provider
  - Mark as Pending
  - Staff Approval
  - Contract


- BackOffice
  - 'Edit' pages for each type of data
    - suppliers
    - contracts
    - deliverymen
    - service providers
    - deliveries
    - services
    - payments
    - bills
    - products
    - package sizes
    - warehouses
    - locations