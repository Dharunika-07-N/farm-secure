# Farm-Secure Database Schema & Data Guide

## Overview
This document explains what data you need to populate in PostgreSQL for the Farm-Secure application to display real-time analytics, outbreak maps, and dashboard information.

---

## Database Models

### 1. **User** (Authentication)
Stores farmer/admin accounts.

**Required Fields:**
- `email` - Unique email address
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `role` - FARMER | ADMIN | INSPECTOR

**Sample Data:**
```sql
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "isVerified", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'farmer@example.com', '$2b$10$...', 'John', 'Doe', 'FARMER', true, NOW(), NOW());
```

---

### 2. **Farm** (Farm Information)
Stores farm details linked to users.

**Required Fields:**
- `name` - Farm name
- `location` - Address/region
- `size` - Farm size (numeric)
- `sizeUnit` - 'acres' | 'hectares'
- `userId` - Reference to User

**Sample Data:**
```sql
INSERT INTO "Farm" (id, name, location, size, "sizeUnit", "userId", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Sunny Side Poultry', 'Karnataka, India', 50.5, 'acres', '<user-id>', NOW(), NOW());
```

---

### 3. **Alert** (Dashboard Notifications)
Real-time alerts shown on the dashboard.

**Required Fields:**
- `title` - Alert headline
- `description` - Detailed message
- `type` - 'warning' | 'info' | 'critical'
- `isRead` - Boolean (false for new alerts)
- `farmId` - Reference to Farm

**Sample Data:**
```sql
INSERT INTO "Alert" (id, title, description, type, "isRead", "farmId", "createdAt")
VALUES 
  (gen_random_uuid(), 'H5N1 Outbreak Nearby', 'Avian Influenza H5N1 confirmed 50km from your farm location.', 'critical', false, '<farm-id>', NOW()),
  (gen_random_uuid(), 'Feed Stock Low', 'Broiler starter feed is below 100kg', 'warning', false, '<farm-id>', NOW());
```

---

### 4. **Compliance** (Biosecurity Tasks)
Compliance checklist items for biosecurity protocols.

**Required Fields:**
- `name` - Task name
- `completed` - Boolean
- `date` - Task date
- `farmId` - Reference to Farm

**Sample Data:**
```sql
INSERT INTO "Compliance" (id, name, completed, date, "farmId")
VALUES 
  (gen_random_uuid(), 'Daily Water Quality Check', true, NOW(), '<farm-id>'),
  (gen_random_uuid(), 'Weekly Disinfection', false, NOW(), '<farm-id>'),
  (gen_random_uuid(), 'Vaccination Schedule Review', false, NOW(), '<farm-id>');
```

---

### 5. **Outbreak** (Disease Map Data) ⭐ NEW
Public disease outbreak data displayed on the map.

**Required Fields:**
- `name` - Outbreak name/location
- `type` - 'avian_influenza' | 'african_swine_fever' | 'newcastle_disease' | 'foot_mouth'
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `severity` - 'high' | 'medium' | 'low'
- `date` - Outbreak date
- `affectedAnimals` - Number of affected animals
- `riskRadius` - Risk zone radius in km

**Sample Data:**
```sql
INSERT INTO "Outbreak" (id, name, type, latitude, longitude, severity, date, "affectedAnimals", "riskRadius", "createdAt")
VALUES 
  (gen_random_uuid(), 'H5N1 Outbreak - Bangalore', 'avian_influenza', 12.9716, 77.5946, 'high', '2024-01-28', 5000, 50, NOW()),
  (gen_random_uuid(), 'Newcastle Disease - Mumbai', 'newcastle_disease', 19.0760, 72.8777, 'medium', '2024-01-20', 2000, 25, NOW()),
  (gen_random_uuid(), 'ASF Alert - Delhi', 'african_swine_fever', 28.6139, 77.2090, 'high', '2024-01-25', 800, 40, NOW());
```

---

### 6. **Crop** (Optional - Livestock/Feed Crops)
Track crops or livestock on the farm.

**Required Fields:**
- `name` - Crop/livestock name
- `plantingDate` - Start date
- `area` - Area in acres/hectares
- `status` - 'PLANTED' | 'GROWING' | 'HARVESTED'
- `farmId` - Reference to Farm

---

### 7. **Inventory** (Optional - Supplies)
Track feed, medicine, equipment stock.

**Required Fields:**
- `itemName` - Item name
- `quantity` - Current stock
- `unit` - 'kg' | 'liters' | 'units'
- `category` - 'SEEDS' | 'FERTILIZER' | 'PESTICIDE' | 'EQUIPMENT'
- `farmId` - Reference to Farm

---

## Quick Start: Seed Your Database

### Option 1: Use the Seed Script (Recommended)
```bash
cd backend
npx ts-node prisma/seed.ts
```

This will create:
- 1 test user (farmer@example.com / password123)
- 1 farm
- 5 compliance tasks
- 2 alerts
- 3 outbreak locations

### Option 2: Manual SQL Insert
Connect to your PostgreSQL database and run the sample SQL queries above.

---

## API Endpoints That Use This Data

### Dashboard (`GET /api/v1/dashboard`)
**Requires:**
- User authentication (JWT token)
- At least 1 Farm linked to the user
- Alerts and Compliance records for that farm

**Returns:**
```json
{
  "stats": {
    "biosecurityScore": "78%",
    "activeProtocols": 5,
    "staffTrained": "8/10",
    "openAlerts": 2
  },
  "alerts": [...],
  "compliance": [...]
}
```

### Outbreak Map (`GET /api/v1/outbreaks`)
**Requires:**
- Outbreak records in the database

**Returns:**
```json
[
  {
    "id": "...",
    "name": "H5N1 Outbreak - Bangalore",
    "type": "avian_influenza",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "severity": "high",
    "date": "2024-01-28T00:00:00.000Z",
    "affectedAnimals": 5000,
    "riskRadius": 50
  }
]
```

---

## Data Requirements Summary

### For Dashboard to Work:
1. ✅ User account (created via registration)
2. ✅ At least 1 Farm
3. ✅ 2-5 Alert records
4. ✅ 3-5 Compliance records

### For Disease Map to Work:
1. ✅ 3+ Outbreak records with valid lat/lng coordinates

### For Full Analytics:
1. ✅ Transaction records (income/expenses)
2. ✅ Inventory records (stock levels)
3. ✅ Crop/Livestock records

---

## Next Steps

1. **Run the seed script** to populate test data
2. **Restart the backend** to load the new Outbreak model
3. **Test the endpoints** using the frontend or Postman
4. **Add more data** as needed for your specific use case

---

## Troubleshooting

**Q: Dashboard shows "No data"**
- Ensure you have Alerts and Compliance records for your farm
- Check that the farm is linked to your logged-in user

**Q: Map is blank**
- Verify Outbreak records exist in the database
- Check that latitude/longitude values are valid
- Ensure the `/api/v1/outbreaks` endpoint returns data

**Q: 500 errors on dashboard**
- Check backend logs for Prisma errors
- Verify all foreign keys (userId, farmId) are valid UUIDs
