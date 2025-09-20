# SwiftLogistics Demo Accounts 🎭

This application includes three fully functional demo accounts with hardcoded data for demonstration purposes.

## Demo Account Credentials

### 🔴 Admin Account

- **Email:** `admin@swifttrack.com`
- **Password:** `Admin123!`
- **Role:** Administrator
- **Name:** Sarah Johnson
- **Features:** Full system access, dashboard analytics, driver management, order oversight

### 🔵 Client Account

- **Email:** `client1@example.com`
- **Password:** `Client123!`
- **Role:** Client/Customer
- **Name:** Michael Chen
- **Company:** TechCorp Solutions
- **Features:** Order creation, shipment tracking, delivery management

### 🟢 Driver Account

- **Email:** `driver1@swifttrack.com`
- **Password:** `Driver123!`
- **Role:** Driver
- **Name:** Ravi Perera
- **Vehicle:** CAB-1234
- **Features:** Order assignments, location updates, delivery confirmations

## Demo Data Overview

### Orders (5 sample orders with various statuses)

- **ORD-2024-001:** Delivered electronics order (Client: Michael Chen)
- **ORD-2024-002:** In-transit furniture order (High priority)
- **ORD-2024-003:** Picked documents order (Confidential delivery)
- **ORD-2024-004:** Medical supplies at warehouse (Temperature sensitive)
- **ORD-2024-005:** Industrial equipment order (Requires crane)

### Drivers (3 active drivers)

- **Ravi Perera** (CAB-1234) - Available, 4.8★ rating
- **Driver #2** (CAB-5678) - On duty, 4.6★ rating
- **Driver #3** (CAB-9012) - Available, 4.9★ rating

### Warehouse Locations (3 facilities)

- **Main Distribution Center** (Colombo) - 245/10,000 capacity
- **Southern Hub** (Galle) - 89/5,000 capacity
- **Central Depot** (Kandy) - 156/7,500 capacity

### Dashboard Analytics

- **1,247** total orders processed
- **89** active orders
- **156** total drivers
- **23** drivers currently active
- **₹2,450,000** total revenue
- **4.2 hours** average delivery time

## Features by Portal

### Admin Portal (`/admin/dashboard`)

- Real-time dashboard with order statistics
- Driver management and performance tracking
- Warehouse inventory management
- Order assignment and status updates
- System analytics and reporting

### Client Portal (`/dashboard`)

- Personal order history
- Order creation and tracking
- Delivery status notifications
- Profile management
- Recent activity overview

### Driver Portal (Currently integrated with admin)

- Assigned order management
- Location tracking updates
- Delivery confirmation
- Performance metrics
- Availability status

## Demo Data Features

### 🎯 Realistic Scenarios

- **Mixed order statuses:** From placed to delivered
- **Priority handling:** Urgent and standard deliveries
- **Geographic spread:** Orders across Sri Lankan cities
- **Business variety:** Electronics, furniture, documents, medical supplies

### 📊 Rich Analytics

- **Performance metrics:** Driver ratings and completion rates
- **Inventory tracking:** Real-time warehouse capacity
- **Revenue insights:** Order values and financial data
- **Operational data:** Delivery times and success rates

### 🔄 Interactive Elements

- **Order tracking:** Step-by-step delivery progress
- **Status updates:** Real-time order state changes
- **Location services:** GPS coordinates for deliveries
- **Notifications:** System alerts and updates

## Demo Mode Indicators

When logged in with a demo account, you'll see:

- **Demo Banner:** Appears at the top of each page
- **Role Identification:** Clear indication of user type and capabilities
- **Simulated Data Notice:** All data marked as demonstration purposes

## Technical Implementation

### Mock Data Architecture

- **`mockData.ts`:** Core demo data definitions
- **`mockAPI.ts`:** API response simulation
- **`useDemoData.ts`:** React hook for demo functionality
- **`DemoBanner.tsx`:** Visual demo mode indicator

### Authentication Flow

1. Login attempt with demo credentials
2. Mock authentication service validation
3. Token generation (base64 encoded)
4. Role-based redirection
5. Mock API activation for all subsequent requests

### Data Persistence

- Demo data stored in memory during session
- Changes persist until page refresh
- No database interaction required
- Instant response times

## Usage Instructions

### For Presentations

1. **Start with Admin:** Show system overview and capabilities
2. **Switch to Client:** Demonstrate customer experience
3. **Check Driver View:** Display operational workflow
4. **Live Interactions:** Create orders, update statuses, track deliveries

### For Testing

1. **Login Process:** Test each account type
2. **Feature Coverage:** Verify all portal functionalities
3. **Data Integrity:** Ensure mock data displays correctly
4. **Responsive Design:** Test across different screen sizes

### For Development

1. **API Integration:** Mock services mirror real API structure
2. **Component Testing:** Verify UI components with realistic data
3. **State Management:** Test authentication and data flows
4. **Error Handling:** Simulate various success/failure scenarios

## Security Notes

⚠️ **Demo accounts are for demonstration purposes only:**

- No real API calls made for demo users
- Mock authentication tokens used
- Data not persisted between sessions
- Not suitable for production use

## Next Steps

After exploring with demo accounts:

1. **Configure Real Backend:** Connect to actual SwiftTrack API
2. **Update Environment:** Set production API endpoints
3. **Remove Demo Code:** Clean up mock services for production
4. **User Management:** Implement real user registration/authentication

---

_Demo data includes realistic Sri Lankan locations, names, and business scenarios for authentic testing experience._
