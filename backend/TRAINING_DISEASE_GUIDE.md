# Training & Disease Data Integration Guide

## Overview
This guide explains the newly integrated training modules and disease information features in Farm-Secure.

---

## 📚 Training Modules

### Database Model
The `TrainingModule` model stores comprehensive training content for farmers:

```prisma
model TrainingModule {
  id          String   @id @default(uuid())
  name        String
  description String
  duration    Int      // in minutes
  level       String   // Beginner, Intermediate, Advanced
  category    String   // Biosecurity, Health Management, etc.
  objectives  String   // JSON array of learning objectives
  content     String   // JSON object with sections
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Available Modules
8 comprehensive training modules have been imported:

1. **Biosecurity Basics** (45 min, Beginner)
   - Introduction to biosecurity principles
   - Disease threat identification
   - Basic prevention measures

2. **Disease Recognition** (60 min, Intermediate)
   - Clinical signs identification
   - Disease transmission pathways
   - When to call a veterinarian

3. **Vaccination Protocols** (50 min, Intermediate)
   - Vaccination scheduling
   - Vaccine storage and handling
   - Administration techniques

4. **Hygiene and Sanitation** (55 min, Beginner)
   - Cleaning protocols
   - Disinfectant selection
   - Hygiene standards maintenance

5. **Visitor Management** (40 min, Beginner)
   - Visitor protocols
   - Access control measures
   - Visitor log maintenance

6. **Emergency Response** (70 min, Advanced)
   - Emergency response planning
   - Quarantine procedures
   - Authority coordination

7. **Record Keeping** (35 min, Beginner)
   - Record-keeping requirements
   - Digital record systems
   - Regulatory compliance

8. **Feed Safety** (45 min, Intermediate)
   - Feed contamination risks
   - Safe storage practices
   - Feed quality monitoring

### API Endpoints

#### Get All Training Modules
```http
GET /api/v1/training/modules
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Biosecurity Basics",
    "description": "Introduction to fundamental biosecurity principles...",
    "duration": 45,
    "level": "Beginner",
    "category": "Biosecurity",
    "objectives": [
      "Understand the importance of biosecurity",
      "Identify common disease threats",
      "Implement basic prevention measures"
    ],
    "content": {
      "sections": [...]
    },
    "isActive": true,
    "createdAt": "2025-12-22T...",
    "updatedAt": "2025-12-22T..."
  }
]
```

#### Get Specific Module
```http
GET /api/v1/training/modules/:id
```

#### Get Categories
```http
GET /api/v1/training/categories
```

**Response:**
```json
["Biosecurity", "Health Management", "Prevention", "Operations", "Crisis Management"]
```

---

## 🦠 Disease Information

### Database Model
The `Disease` model stores comprehensive disease information:

```prisma
model Disease {
  id                  String   @id @default(uuid())
  name                String   @unique
  type                String   // Viral, Bacterial, Parasitic, Fungal
  affectedSpecies     String   // JSON array of species
  symptoms            String   // JSON array of symptoms
  preventionMeasures  String   // JSON array of prevention measures
  treatment           String   // Text description of treatment
  riskLevel           String   // High, Medium, Low
  transmissionRoutes  String   // JSON array of transmission routes
  incubationPeriod    String?
  mortality           String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

### Available Diseases
10 major livestock diseases have been imported:

#### High-Risk Diseases
1. **African Swine Fever (ASF)** - Viral, Pigs
2. **Foot and Mouth Disease (FMD)** - Viral, Multiple species
3. **Avian Influenza** - Viral, Poultry
4. **Newcastle Disease** - Viral, Poultry
5. **Classical Swine Fever (CSF)** - Viral, Pigs

#### Medium-Risk Diseases
6. **PRRS** - Viral, Pigs
7. **Infectious Bronchitis** - Viral, Poultry
8. **Marek's Disease** - Viral, Poultry
9. **Bovine Tuberculosis** - Bacterial, Multiple species
10. **Brucellosis** - Bacterial, Multiple species

### API Endpoints

#### Get All Diseases
```http
GET /api/v1/diseases
```

**Query Parameters:**
- `riskLevel` - Filter by risk level (High, Medium, Low)
- `type` - Filter by disease type (Viral, Bacterial)
- `species` - Filter by affected species (Pig, Poultry, Cattle, etc.)

**Example:**
```http
GET /api/v1/diseases?riskLevel=High&species=Pig
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "African Swine Fever (ASF)",
    "type": "Viral",
    "affectedSpecies": ["Pig"],
    "symptoms": [
      "High fever (40.5-42°C)",
      "Loss of appetite",
      "Lethargy and weakness",
      ...
    ],
    "preventionMeasures": [
      "Strict biosecurity protocols at farm entry points",
      "Avoid feeding swill or food waste to pigs",
      ...
    ],
    "treatment": "No vaccine or treatment available. Infected animals must be culled...",
    "riskLevel": "High",
    "transmissionRoutes": [
      "Direct contact with infected pigs",
      "Contaminated feed and water",
      ...
    ],
    "incubationPeriod": "4-19 days",
    "mortality": "Up to 100% in acute cases"
  }
]
```

#### Get Specific Disease
```http
GET /api/v1/diseases/:id
```

#### Search Diseases by Name
```http
GET /api/v1/diseases/search/:name
```

**Example:**
```http
GET /api/v1/diseases/search/swine
```

---

## 🚀 Usage Instructions

### 1. Import Data (Already Done)
The data has been imported using:
```bash
cd backend
npx ts-node scripts/import-data.ts
```

### 2. Access from Frontend
Use the API endpoints in your React components:

```typescript
// Fetch training modules
const response = await fetch('http://localhost:5000/api/v1/training/modules');
const modules = await response.json();

// Fetch diseases
const response = await fetch('http://localhost:5000/api/v1/diseases?riskLevel=High');
const diseases = await response.json();
```

### 3. Update Training Page
The TrainingModule page can now fetch real data instead of using hardcoded content.

---

## 📊 Data Statistics

### Training Modules
- **Total Modules:** 8
- **Total Duration:** 400 minutes (6.7 hours)
- **Difficulty Levels:** Beginner (4), Intermediate (3), Advanced (1)
- **Categories:** 5 unique categories

### Disease Information
- **Total Diseases:** 10
- **High Risk:** 5 diseases
- **Medium Risk:** 5 diseases
- **Viral Diseases:** 8
- **Bacterial Diseases:** 2
- **Affected Species:** Pig, Poultry, Cattle, Sheep, Goat

---

## 🔄 Updating Data

### Add New Training Module
1. Edit `backend/data/training-modules.json`
2. Run import script: `npx ts-node scripts/import-data.ts`

### Add New Disease
1. Edit `backend/data/diseases.json`
2. Run import script: `npx ts-node scripts/import-data.ts`

### Modify Existing Data
The import script uses `upsert` for diseases, so re-running it will update existing records.

---

## 🎯 Next Steps

1. **Update Frontend Training Page:**
   - Replace hardcoded data with API calls
   - Add filtering by category and level
   - Implement progress tracking

2. **Create Disease Information Page:**
   - Display disease cards with filtering
   - Add search functionality
   - Link to related training modules

3. **Integrate with Dashboard:**
   - Show recommended training based on farm type
   - Display disease alerts based on location
   - Track training completion

4. **Add User Progress Tracking:**
   - Create UserTrainingProgress model
   - Track completed modules
   - Award certificates

---

## 📝 Notes

- All JSON fields are automatically parsed in the API responses
- The import script is idempotent - safe to run multiple times
- Training content includes video, reading, and quiz sections
- Disease data includes comprehensive prevention and treatment information

---

## 🐛 Troubleshooting

**Issue:** Prisma client not recognizing new models
**Solution:** Run `npx prisma generate` to regenerate the Prisma client

**Issue:** Import script fails
**Solution:** Ensure database is running and migrations are applied

**Issue:** API returns empty arrays
**Solution:** Check that import script completed successfully

---

For more information, see:
- `backend/data/training-modules.json` - Training module data
- `backend/data/diseases.json` - Disease information data
- `backend/scripts/import-data.ts` - Import script
- `backend/src/routes/training.routes.ts` - Training API routes
- `backend/src/routes/disease.routes.ts` - Disease API routes

---

## 📈 Analytics & Risk Assessment Data

### Database Models

#### 1. DiseaseStatistic
Stores historical outbreak data for trend analysis.
```prisma
model DiseaseStatistic {
  id                String   @id @default(uuid())
  state             String
  year              Int
  diseaseType       String   // "Avian Influenza" or "African Swine Fever"
  deaths            Int
  outbreaks         Int
  culled            Int?     // AI specific
  affectedDistricts Int?     // ASF specific
  metadata          String?  // JSON
}
```

#### 2. RiskFactor
Stores weighted risk factors used for calculating farm risk scores.
```prisma
model RiskFactor {
  id                String   @id @default(uuid())
  factor            String
  asfRiskMultiplier Float
  aiRiskMultiplier  Float
  evidence          Boolean
}
```

#### 3. BiosecurityIndicator
Stores 20 key indicators for biosecurity scoring.
```prisma
model BiosecurityIndicator {
  id                     String   @id @default(uuid())
  variableName           String
  importanceWeight       Float
  evidenceSource         String
  applicableTo           String
  poorPracticePrevalence Float
}
```

### Data Summary
- **Avian Influenza:** 30 records (2021-2023) across 10 states.
- **African Swine Fever:** 36 records (2021-2023) across 12 states (mostly NE India).
- **Risk Indicators:** 20 scientifically weighted indicators (e.g., visitor control, disinfection).
- **Risk Factors:** 10 multipliers based on farm practices (e.g., "No Vaccination" = 3.2x risk).

### Usage
This data powers:
1. **Trend Analysis:** Graphs showing outbreaks vs years per state.
2. **Risk Calculator:** Dynamic forms that use the `RiskFactor` multipliers to generate a user's risk score.
3. **Biosecurity Audit:** Checklist features using the weighed `BiosecurityIndicator` items.
