# SIH 2025 - Quick Start Commands

## 🚀 Run These Commands in Order

### Step 1: Generate Synthetic Farm Data (1,000 farms)

```powershell
# Install Python dependencies (if not already installed)
pip install pandas numpy

# Navigate to project root
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure

# Generate synthetic farms
python data\scripts\generate_synthetic_farms.py
```

**Expected Output**: 
- ✓ `data/processed/synthetic_farms_1000.csv` created
- ✓ `data/processed/dataset_summary.json` created
- ✓ Statistics displayed in console

---

### Step 2: Install TypeScript Dependencies

```powershell
# Navigate to backend
cd backend

# Install CSV parser
npm install csv-parse
```

---

### Step 3: Import Data into Database

```powershell
# Make sure you're in the backend directory
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend

# Run import script
npx ts-node ../data/scripts/import-farm-data.ts
```

**Expected Output**:
- ✓ Demo user created: demo@farmsecure.com
- ✓ 1,000 farms imported
- ✓ Database statistics displayed

---

### Step 4: Verify Data in Database

```powershell
# Open Prisma Studio to view data
npx prisma studio
```

**What to Check**:
- Navigate to `Farm` table
- Should see 1,000 farms
- Check `infrastructure` field for biosecurity data
- Verify `latitude`/`longitude` populated

---

### Step 5: Start the Application

```powershell
# Terminal 1: Start Backend
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend
npm run dev

# Terminal 2: Start Frontend
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\frontend
npm run dev
```

---

## 🎯 Quick Verification Checklist

After running all commands, verify:

- [ ] `data/processed/synthetic_farms_1000.csv` exists (should be ~500KB)
- [ ] `data/processed/dataset_summary.json` exists
- [ ] Backend starts without errors on port 5000
- [ ] Frontend starts without errors on port 5173
- [ ] Can login with demo@farmsecure.com (password: Demo@123)
- [ ] Dashboard shows farms on map
- [ ] Prisma Studio shows 1,000 farms in database

---

## 🆘 Troubleshooting

### Python Script Fails

**Error**: `ModuleNotFoundError: No module named 'pandas'`
```powershell
pip install pandas numpy
```

**Error**: `FileNotFoundError`
```powershell
# Make sure you're in the farm-secure directory
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure
```

---

### TypeScript Import Fails

**Error**: `Cannot find module 'csv-parse'`
```powershell
cd backend
npm install csv-parse
```

**Error**: `Prisma Client not generated`
```powershell
cd backend
npx prisma generate
```

---

### Database Connection Error

**Error**: `Can't reach database server`
```powershell
# Check if PostgreSQL is running
# Verify DATABASE_URL in backend/.env
```

---

## 📊 Expected Statistics

After import, you should see:

**Total Farms**: 1,000
- Pig Farms: 600
- Poultry Farms: 400

**Biosecurity Score Distribution**:
- Mean: ~48/100
- Median: ~47/100

**Risk Level Distribution**:
- Critical: ~16%
- High: ~39%
- Medium: ~30%
- Low: ~15%

**Geographic Distribution**:
- Pig farms: NE India states (Nagaland, Assam, Mizoram, etc.)
- Poultry farms: South India states (Tamil Nadu, Andhra Pradesh, etc.)

---

## 🎓 For SIH Demo

Once data is imported, you can demonstrate:

1. **Interactive Map**: 1,000 farms with color-coded risk levels
2. **Risk Assessment**: Filter farms by biosecurity score
3. **State-wise Analysis**: Compare biosecurity across states
4. **Training Impact**: Show TN poultry vs NE pig farm compliance
5. **Outbreak Proximity**: (After adding ASF data) Show farms near outbreak zones

---

## 📝 Optional: Download ASF Government Data

If you have time, download the official ASF mortality data:

1. Visit: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023
2. Download CSV
3. Save as: `data\raw\asf_mortality_2020_2023.csv`
4. Re-run import script: `npx ts-node ../data/scripts/import-farm-data.ts`

This will add historical outbreak data to your database!

---

## ✅ Success Criteria

You're ready for SIH demo when:

- ✓ All 1,000 farms visible in dashboard
- ✓ Map shows geographic distribution
- ✓ Biosecurity scores displayed correctly
- ✓ Risk levels color-coded (red=critical, yellow=high, etc.)
- ✓ Can filter/search farms
- ✓ Statistics match research data

---

**Total Time Required**: 10-15 minutes

**Ready to start?** Copy-paste the commands above! 🚀
