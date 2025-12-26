# Real-World Data Format Guide

## 📋 Overview

This guide shows you how to format your downloaded data as JSON files for import into the Farm-Secure system.

**Important**: This system imports **ONLY real-world data** you provide. No synthetic data is generated.

---

## 📁 Where to Place Your JSON Files

Save all JSON files in:
```
c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\
```

---

## 📊 Supported Data Types

### 1. **ASF Mortality Data** (Priority: HIGH)

**Filename**: `asf_mortality_data.json`

**Source**: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023

**Format Option A** (Array of records):
```json
[
  {
    "state": "Assam",
    "year": 2020,
    "deaths": 2345,
    "culled": 0
  },
  {
    "state": "Nagaland",
    "year": 2020,
    "deaths": 1567,
    "culled": 0
  },
  {
    "state": "Assam",
    "year": 2021,
    "deaths": 1234,
    "culled": 567
  }
]
```

**Format Option B** (Alternative field names):
```json
[
  {
    "State/ UT": "Assam",
    "Year": "2020",
    "Died": "2345",
    "Culled": "0"
  }
]
```

**Flexible Fields** (script accepts any of these):
- State: `state`, `State/ UT`, `State`, `location`
- Year: `year`, `Year`, or extracted from `date`/`Date`
- Deaths: `deaths`, `died`, `Deaths`, `Died`
- Culled: `culled`, `Culled`

---

### 2. **Livestock Census Data** (Priority: MEDIUM)

**Filename**: `livestock_census_data.json`

**Source**: https://data.gov.in/ (search "livestock census")

**Format**:
```json
[
  {
    "state": "Tamil Nadu",
    "district": "Namakkal",
    "pigs": 15000,
    "poultry": 250000,
    "cattle": 50000,
    "year": 2023
  },
  {
    "state": "Nagaland",
    "district": "Dimapur",
    "pigs": 45000,
    "poultry": 80000,
    "year": 2023
  }
]
```

**Note**: This data is stored for reference and used for population density analysis.

---

### 3. **DAHD Surveillance Data** (Priority: MEDIUM)

**Filename**: `dahd_surveillance_data.json`

**Source**: https://monitor.dahd.gov.in/livestock-health-disease

**Format**:
```json
[
  {
    "disease": "Avian Influenza",
    "location": "Kerala",
    "date": "2024-01-15",
    "cases": 5000,
    "status": "Active"
  },
  {
    "disease": "African Swine Fever",
    "location": "Mizoram",
    "date": "2024-02-20",
    "cases": 1200,
    "status": "Contained"
  }
]
```

**Flexible Fields**:
- Disease: `disease`, `Disease`, `type`
- Location: `location`, `Location`, `state`, `State`
- Date: `date`, `Date`, `reportDate`
- Cases: `cases`, `Cases`, `affected`

---

### 4. **Custom Farm Data** (Priority: LOW)

**Filename**: `custom_farm_data.json`

**Source**: Your own farm records or research data

**Format**:
```json
[
  {
    "name": "Green Valley Pig Farm",
    "location": "Nagaland",
    "latitude": 26.1584,
    "longitude": 94.5624,
    "livestockType": "Pig",
    "animalCount": 150,
    "size": 5.5,
    "sizeUnit": "acres",
    "establishmentDate": "2020-01-15",
    "description": "Small-scale pig farm with moderate biosecurity",
    "infrastructure": {
      "biosecurity_score": 45,
      "has_fencing": true,
      "has_footbath": false,
      "quarantine_facility": false
    }
  },
  {
    "name": "Sunrise Poultry Farm",
    "location": "Tamil Nadu",
    "latitude": 11.1271,
    "longitude": 78.6569,
    "livestockType": "Poultry",
    "animalCount": 25000,
    "size": 10,
    "sizeUnit": "acres",
    "description": "Commercial layer farm with good biosecurity"
  }
]
```

**Flexible Fields**:
- Name: `name`, `farmName`, `farm_name`
- Location: `location`, `state`, `address`
- Coordinates: `latitude`/`lat`, `longitude`/`lng`/`lon`
- Type: `livestockType`, `type`, `farm_type`
- Count: `animalCount`, `animals`, `population`

---

## 🔄 How to Convert Your Data to JSON

### From CSV (Excel/Google Sheets)

1. **Open your CSV file** in Excel or Google Sheets
2. **Use an online converter**:
   - Visit: https://csvjson.com/csv2json
   - Paste your CSV data
   - Click "Convert"
   - Copy the JSON output
3. **Save as JSON file** in `data/raw/`

### From Government Portal

If the data.gov.in portal provides JSON export:
1. Click "Download" or "API" button
2. Select "JSON" format
3. Save directly to `data/raw/`

If only CSV is available:
1. Download CSV
2. Convert using csvjson.com
3. Save as JSON

### From PDF/Table

1. Copy table data from PDF
2. Paste into Excel
3. Save as CSV
4. Convert CSV to JSON (see above)

---

## ✅ JSON Validation

Before importing, validate your JSON:

1. **Online Validator**: https://jsonlint.com/
2. **Paste your JSON**
3. **Click "Validate JSON"**
4. **Fix any errors** shown

---

## 🚀 Import Your Data

Once you have your JSON files ready:

```powershell
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend

# Run the real-world data importer
npx ts-node ../data/scripts/import-realworld-data.ts
```

**The script will**:
- ✓ Look for JSON files in `data/raw/`
- ✓ Parse and validate each file
- ✓ Import data into PostgreSQL
- ✓ Show statistics and summary
- ✓ Skip any invalid records

---

## 📝 Example: Complete Workflow

### Step 1: Download ASF Data

1. Visit: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023
2. Download CSV or copy table
3. Convert to JSON using csvjson.com
4. Save as: `data/raw/asf_mortality_data.json`

### Step 2: Verify JSON Format

```json
[
  {
    "state": "Assam",
    "year": 2020,
    "deaths": 2345,
    "culled": 0
  },
  {
    "state": "Nagaland", 
    "year": 2020,
    "deaths": 1567,
    "culled": 0
  }
]
```

### Step 3: Import

```powershell
cd backend
npx ts-node ../data/scripts/import-realworld-data.ts
```

### Step 4: Verify

```
📊 Importing ASF Mortality Data...
Source: data/raw/asf_mortality_data.json
  Found 2 records
  ✓ Imported: Assam (2020) - 2345 animals affected
  ✓ Imported: Nagaland (2020) - 1567 animals affected

  Summary: 2 imported, 0 skipped

DATABASE STATISTICS
══════════════════════════════════════════════════════════════════════
📊 Farms: 0
🦠 Outbreaks: 2

  By Disease Type:
    - african_swine_fever: 2

  By Severity:
    - high: 2
══════════════════════════════════════════════════════════════════════

✅ IMPORT COMPLETE!
   Total records imported: 2
   Total records skipped: 0
```

---

## 🎯 Minimum Required Data

To have a functional demo, you need **at least one** of:

1. **ASF Mortality Data** (Recommended)
   - Shows outbreak history
   - Enables risk zone mapping
   - Demonstrates proximity alerts

2. **Custom Farm Data**
   - Shows farm management features
   - Demonstrates biosecurity tracking
   - Enables compliance monitoring

---

## ⚠️ Important Notes

1. **No Synthetic Data**: This system does NOT generate fake data
2. **Real Sources Only**: All data must come from official/research sources
3. **Flexible Parsing**: Script handles various JSON field names
4. **Error Handling**: Invalid records are skipped, not failed
5. **Incremental Import**: You can run the script multiple times to add more data

---

## 🆘 Troubleshooting

### "File not found"
- Check file is in `data/raw/` directory
- Verify filename matches exactly (case-sensitive)
- Ensure file has `.json` extension

### "JSON parse error"
- Validate JSON at jsonlint.com
- Check for missing commas, brackets
- Ensure proper quote usage (double quotes only)

### "No data imported"
- Check JSON structure matches examples
- Verify required fields are present
- Look at console for specific error messages

### "Unknown state"
- Script will use default coordinates for unknown states
- Add state to `getStateCoordinates()` function if needed

---

## 📞 Need Help?

If you're having trouble converting your data:

1. **Share the data format** you have (CSV, PDF, etc.)
2. **Show a sample row** of your data
3. I'll help you create the correct JSON format!

---

## ✨ Ready to Import!

Once you have your JSON files:

```powershell
# Place files in data/raw/
# Then run:
cd backend
npx ts-node ../data/scripts/import-realworld-data.ts
```

**Your real-world data will be imported in seconds!** 🚀
