# ASF Mortality Data - Download Instructions

## 📥 What You Need to Download

**File**: State/UT-wise Number of Animal Death due to African Swine Fever (ASF) in Pigs during 2022 and 2023

**Source**: Open Government Data Platform India

**URL**: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023

---

## 📋 Expected Data Format

The CSV file should contain these columns:

| Column Name | Description | Example |
|------------|-------------|---------|
| Sl. No. | Serial number | 1, 2, 3... |
| State/ UT | State or Union Territory name | Nagaland, Assam, etc. |
| 2020 - Died | Number of pigs died in 2020 | 1234 |
| 2021 - Died | Number of pigs died in 2021 | 567 |
| 2021 - Culled | Number of pigs culled in 2021 | 890 |

---

## 🔍 How to Download

### Option 1: Direct Download (If Available)

1. Visit the URL above
2. Look for a **"Download"** button or **"Preview"** button
3. Click to download the CSV file
4. Save as: `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\asf_mortality_2020_2023.csv`

### Option 2: Manual Copy-Paste (If Download Fails)

1. Visit the URL
2. If you see a data table displayed on the page
3. Copy the entire table
4. Paste into Excel or Google Sheets
5. Save as CSV with the filename above

### Option 3: API Request (If Available)

The page mentions an API, but it shows "No Result Found". If the API becomes available:

```powershell
# Generate API key on the website first
# Then use curl or similar tool to fetch data
```

---

## ✅ After Downloading

Once you have the file saved at:
```
c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\asf_mortality_2020_2023.csv
```

Run the import script:
```powershell
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend
npx ts-node ../data/scripts/import-farm-data.ts
```

The script will automatically:
- Detect the ASF data file
- Parse state-wise mortality numbers
- Create outbreak records in the database
- Calculate severity and risk radius
- Link to farm locations

---

## 📊 What This Data Provides

The ASF mortality data will enable:

1. **Historical Outbreak Mapping**: Show where ASF hit hardest in 2020-2021
2. **Risk Zone Calculation**: Identify high-risk states for pig farming
3. **Proximity Alerts**: Warn farms near previous outbreak locations
4. **Trend Analysis**: Compare outbreak patterns across states
5. **Resource Allocation**: Prioritize biosecurity training in affected regions

---

## 🔄 Alternative: Use Synthetic Outbreak Data

If you can't download the government data right now, the system will still work with synthetic farm data. You can:

1. Skip the ASF data for now
2. Use the 1,000 synthetic farms (already created)
3. Add ASF data later when available
4. The import script handles both scenarios

---

## 📝 Sample Data (For Reference)

Based on the government source description, the data might look like:

```csv
Sl. No.,State/ UT,2020 - Died,2021 - Died,2021 - Culled
1,Assam,2345,1234,567
2,Nagaland,1567,890,234
3,Mizoram,890,456,123
4,Meghalaya,456,234,89
...
```

---

## ⚠️ Important Notes

1. **File Size**: The government portal shows 934 bytes - this is a VERY small file (probably < 20 rows)
2. **Data Period**: Covers 2020-2023 (though columns show 2020-2021)
3. **Source**: Rajya Sabha Question No. 92, answered on 2nd February 2024
4. **Granularity**: Quarterly data at state/UT level

---

## 🆘 If Download Fails

If you cannot access the file:

1. **Try alternative government portals**:
   - DAHD Surveillance Dashboard: https://monitor.dahd.gov.in/livestock-health-disease
   - ICAR-NIHSAD: https://niah.icar.gov.in/

2. **Use research paper data**:
   - The NE India survey already provides ASF context
   - You can proceed without this specific file

3. **Contact me**:
   - Share any error messages you see
   - I can help find alternative sources

---

## ✨ Pro Tip

For your SIH demo, even without the exact government CSV, you can:

- Use the research paper statistics (1,000 farms surveyed)
- Reference the government source in your presentation
- Show the import capability (even if data is synthetic)
- Demonstrate the system's readiness for real data integration

The judges will appreciate that you've built a **production-ready system** that can ingest official data when available!

---

**Status**: ⏳ Waiting for you to download this file

**Priority**: Medium (Nice to have, but not blocking)

**Next Step**: Try downloading from the URL, or let me know if you encounter any issues!
