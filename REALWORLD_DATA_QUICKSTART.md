# Real-World Data Import - Quick Reference

## 🎯 Your Task

Download real data from government/research sources and convert to JSON format.

---

## 📥 Step-by-Step Process

### 1. Download Data from Government Portal

**Primary Source**: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023

**What to do**:
- Click "Download" or "Preview" button
- Save the CSV file or copy the table data

### 2. Convert to JSON

**Option A - Online Converter**:
1. Go to: https://csvjson.com/csv2json
2. Paste your CSV data
3. Click "Convert"
4. Copy the JSON output

**Option B - Manual**:
1. Open template file: `data/raw/asf_mortality_data.json.template`
2. Fill in the real numbers you downloaded
3. Save as: `asf_mortality_data.json` (remove `.template`)

### 3. Save JSON File

Save in: `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\`

**Required filename**: `asf_mortality_data.json`

### 4. Run Import Script

```powershell
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend
npx ts-node ../data/scripts/import-realworld-data.ts
```

---

## 📋 Example: What Your JSON Should Look Like

If you downloaded data showing:
- Assam: 2345 deaths in 2020
- Nagaland: 1567 deaths in 2020
- Mizoram: 890 deaths in 2021

Your JSON file should be:

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
    "state": "Mizoram",
    "year": 2021,
    "deaths": 890,
    "culled": 0
  }
]
```

---

## ✅ Checklist

Before running import:

- [ ] Downloaded data from data.gov.in
- [ ] Converted to JSON format
- [ ] Saved as `asf_mortality_data.json` in `data/raw/`
- [ ] Validated JSON at https://jsonlint.com/
- [ ] Ready to run import script

---

## 🚀 Quick Commands

```powershell
# Navigate to backend
cd c:\Users\Admin\Desktop\biosecure_data\farm-secure\backend

# Install dependency (first time only)
npm install csv-parse

# Run import
npx ts-node ../data/scripts/import-realworld-data.ts

# Verify in database
npx prisma studio
```

---

## 📊 What Happens After Import

The script will:
1. ✓ Read your JSON file
2. ✓ Create outbreak records in database
3. ✓ Calculate severity levels (high/medium/low)
4. ✓ Assign risk radius for each outbreak
5. ✓ Show statistics summary

---

## 🆘 If You Can't Download the Data

**Option 1**: Share what you see on the government portal
- Take a screenshot of the table
- Copy-paste the table text
- I'll help you format it as JSON

**Option 2**: Use alternative sources
- DAHD Surveillance Dashboard
- Research papers with outbreak data
- FAO/WOAH reports

**Option 3**: Start with minimal data
- Even 3-5 outbreak records are enough for demo
- You can add more data later

---

## 💡 Pro Tip

For SIH demo, you don't need ALL the data. Even a small dataset is valuable if it's **real and verifiable**!

**Minimum viable data**:
- 5-10 ASF outbreak records
- OR 10-20 farm records
- OR any combination of real data

This is better than 1000 synthetic records!

---

## 📞 Need Help?

If you're stuck:
1. Show me what format the data is in (screenshot/sample)
2. I'll create the exact JSON format you need
3. You just fill in the numbers!

---

**Ready?** Download your data and let's import it! 🚀
