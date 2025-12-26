# Data Collection Plan for SIH 2025 - Digital Farm Management Portal

## 📋 Summary

Based on your SIH 2025 requirements and the document provided, here's what data you should collect and how to provide it to me for integration into your Farm-Secure application.

---

## ✅ Data I've Already Extracted (No Action Needed)

I've successfully extracted the following data from online sources:

### 1. **Northeast India Pig Farm Biosecurity Survey** ✓
- **Source**: PMC Article 10352026
- **Sample Size**: 1,000 pig farms across 4 districts (Dimapur, Kohima, Phek, Mon)
- **Key Metrics Extracted**:
  - **Poor Biosecurity Rates**:
    - Only 6.9% have farm fencing
    - 99.3% lack footbaths
    - 80% purchase from unknown sources
    - 90% don't change clothes before farm work
    - Only 2% quarantine sick animals
  - **Disease Prevalence**:
    - 78.4% report inappetence
    - 71.2% report diarrhea
    - 55.7% report skin rashes
  - **Farm Characteristics**:
    - 83% rear pigs for fattening
    - 78.5% practice swill feeding
    - 67% involved in wild boar hunting
    - 65% in urban areas aware of ASF (vs 20% in rural)

### 2. **Tamil Nadu Poultry Biosecurity Training Data** ✓
- **Source**: PMC Article 12051024
- **Sample Size**: 89 commercial poultry farms (32 desi, 27 broiler, 30 layer)
- **Key Metrics Extracted**:
  - **Post-Training Adoption Rates**:
    - Farm fencing: 62.96% (broiler), 43.75% (desi)
    - Foot/vehicle baths: 55.56% (broiler), 46.67% (layer)
    - Chlorinated water: 100% (broiler & layer)
    - Disease isolation: 63.3% (layer), 55.56% (broiler)
    - Dead bird disposal: 66.67% (broiler), 53.33% (layer)
  - **Demographics**:
    - 88.8% male, 11.2% female farmers
    - 48.3% aged 21-40 years
    - 93.3% manage <25,000 birds
    - 56.2% have 5-20 years experience

---

## ⚠️ Data You Need to Download & Provide

### Priority 1: ASF Mortality Data (Government Source)

**Source**: https://www.data.gov.in/resource/stateut-wise-number-animal-death-due-african-swine-fever-asf-pigs-during-2022-and-2023

**Status**: ⚠️ **API Not Available** - The government portal shows "No Result Found" for API access

**What to Do**:
1. Visit the link above
2. Look for a **"Download"** or **"Preview"** button
3. Download the CSV/Excel file (File size: 934 bytes - very small!)
4. **Expected Data Fields**:
   - Sl. No.
   - State/UT
   - 2020 - Died
   - 2021 - Died
   - 2021 - Culled

5. **How to Provide to Me**:
   - **Option A**: Place the file in `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\asf_mortality_2020_2023.csv`
   - **Option B**: Copy-paste the table data directly in our chat
   - **Option C**: If the file is very small, you can open it and share the contents

**Why This Matters**: This is official government data on ASF outbreaks by state, which will calibrate your risk models and outbreak mapping.

---

### Priority 2: Livestock Census Data (Tamil Nadu)

**Source**: https://data.gov.in/ (search "livestock census Tamil Nadu")

**What to Do**:
1. I see you already have a browser open searching for this!
2. Look for datasets with:
   - District-wise pig population
   - District-wise poultry population
   - Livestock density per square kilometer

3. **How to Provide to Me**:
   - Download CSV files and place in `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\livestock_census_tn.csv`

**Why This Matters**: Population density data helps calculate outbreak risk zones and identify high-risk areas.

---

### Priority 3: DAHD Surveillance Dashboard Data (Optional)

**Source**: https://monitor.dahd.gov.in/livestock-health-disease

**What to Do**:
1. Visit the dashboard
2. Export any available data on:
   - Vaccination statistics (CSF for pigs)
   - Poultry culling records
   - Disease surveillance reports

3. **How to Provide to Me**:
   - Download and place in `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\dahd_surveillance.csv`

**Why This Matters**: Real-time surveillance data for ongoing outbreak monitoring.

---

### Priority 4: FAO ASF Asia-Pacific Updates (Optional)

**Source**: https://www.fao.org/animal-health/situation-updates/asf-in-asia-pacific/en

**What to Do**:
1. Download recent situation reports (PDFs)
2. Extract key data points:
   - Outbreak locations (countries/regions)
   - Number of cases
   - Dates

3. **How to Provide to Me**:
   - Share PDF files or summarize key outbreak data in text format

**Why This Matters**: Regional context for India-specific risk assessment.

---

## 🚀 What I'll Do With This Data

Once you provide the datasets, I will:

### 1. **Create Synthetic Farm Data** (Calibrated to Real Stats)
```python
# Example: Generate 1,000 synthetic farms based on NE India survey
farms = generate_synthetic_farms(
    total=1000,
    biosecurity_poor_rate=0.93,  # 93% poor biosecurity from survey
    asf_awareness_rural=0.20,    # 20% awareness in rural areas
    swill_feeding_rate=0.785,    # 78.5% practice swill feeding
    # ... more parameters from extracted data
)
```

### 2. **Build Import Scripts**
- CSV parsers for government data
- Database schema mapping
- Data validation and cleaning

### 3. **Create Risk Scoring Models**
```python
# ML model to predict outbreak risk
risk_score = calculate_risk(
    biosecurity_score=farm.biosecurity_score,
    proximity_to_outbreak=distance_to_nearest_outbreak,
    farm_density=local_livestock_density,
    wild_boar_activity=region.wild_boar_hunting_rate
)
```

### 4. **Generate Visualization Dashboards**
- Outbreak heatmaps by state
- Biosecurity compliance charts
- Risk zone mapping

### 5. **Populate Database**
- Import into your existing PostgreSQL database
- Link to existing outbreak tracking system
- Enable real-time risk alerts

---

## 📊 Data Already in Your System

Your Farm-Secure app already has:
- ✅ WAHIS outbreak integration framework
- ✅ ProMED RSS feed capability
- ✅ User farm profiles with biosecurity tracking
- ✅ Geolocation and risk radius calculation
- ✅ Email alert system for outbreaks

**What's Missing**: Real baseline data to calibrate the models!

---

## 🎯 Immediate Action Items

### For You:
1. **Download ASF Mortality CSV** from data.gov.in (Priority 1)
2. **Search for Livestock Census** data on data.gov.in (Priority 2)
3. **Place files** in `c:\Users\Admin\Desktop\biosecure_data\farm-secure\data\raw\`

### For Me (Once You Provide Data):
1. Create import scripts
2. Generate synthetic farm dataset (1,000+ farms)
3. Build ML risk prediction model
4. Create data visualization components
5. Integrate with existing outbreak tracking

---

## 📁 Recommended Folder Structure

```
c:\Users\Admin\Desktop\biosecure_data\farm-secure\
├── data/
│   ├── raw/                          # Place downloaded files here
│   │   ├── asf_mortality_2020_2023.csv
│   │   ├── livestock_census_tn.csv
│   │   ├── dahd_surveillance.csv
│   │   └── ne_india_biosecurity.csv  # I'll create this from extracted data
│   ├── processed/                    # I'll generate these
│   │   ├── synthetic_farms.csv
│   │   ├── outbreak_risk_scores.csv
│   │   └── biosecurity_benchmarks.csv
│   └── scripts/
│       ├── import_asf_data.ts
│       ├── generate_synthetic_farms.py
│       └── calculate_risk_scores.ts
```

---

## 💡 Alternative: Start Without Downloads

If you can't download the government data right now, I can:

1. **Use the data I've already extracted** from the research papers
2. **Generate realistic synthetic data** based on published statistics
3. **Build the entire system** with demo data
4. **Swap in real data later** when you obtain it

This approach lets you build the SIH prototype immediately!

---

## 🆘 Next Steps

**Tell me which approach you prefer**:

**Option A**: "I'll download the government data first" 
→ I'll wait for you to provide the CSV files

**Option B**: "Start with synthetic data now"
→ I'll immediately create import scripts and generate demo data

**Option C**: "Use only the research paper data you extracted"
→ I'll build everything from the NE India and Tamil Nadu studies

Let me know how you'd like to proceed!
