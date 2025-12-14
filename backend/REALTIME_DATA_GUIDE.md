# Real-Time Outbreak Data Integration Guide

## Overview
This guide explains how to integrate real-time animal disease outbreak data into your Farm-Secure application using free public APIs and datasets.

---

## 🌍 Available Free Data Sources

### 1. **WOAH WAHIS** (Recommended)
**World Organisation for Animal Health - World Animal Health Information System**

- **Website:** https://wahis.woah.org
- **Data Coverage:** Global animal disease outbreaks (2005-present)
- **Diseases:** Avian Influenza, African Swine Fever, Newcastle Disease, FMD, and 100+ others
- **Update Frequency:** Real-time (immediate notifications + 6-monthly reports)
- **API Access:** Limited public API, but data can be scraped from public interface

**How to Access:**
1. Visit https://wahis.woah.org/#/dashboards
2. Use browser developer tools to inspect API calls
3. Reverse-engineer the endpoints (they use REST API internally)
4. Alternative: Request official API access from WOAH

**Data Format:**
```json
{
  "reportId": "12345",
  "country": "India",
  "disease": "Highly pathogenic avian influenza",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "reportDate": "2024-01-15",
  "affectedAnimals": 5000
}
```

---

### 2. **FAO EMPRES-i+**
**Food and Agriculture Organization - Emergency Prevention System**

- **Website:** https://empres-i.apps.fao.org
- **Data Coverage:** Global animal disease events
- **Diseases:** ASF, FMD, Avian Influenza, Peste des Petits Ruminants
- **Update Frequency:** Weekly
- **API Access:** No official public API, but datasets available on Kaggle

**Kaggle Datasets:**
- [Animal Disease Outbreaks](https://www.kaggle.com/datasets/fao/animal-disease-outbreaks)
- Download CSV and import into your database

---

### 3. **ProMED-mail**
**Program for Monitoring Emerging Diseases**

- **Website:** https://promedmail.org
- **Data Coverage:** Global disease outbreak reports (human + animal)
- **Update Frequency:** Daily
- **API Access:** RSS feeds available

**RSS Feed:**
```
https://promedmail.org/ajax/runSearch.php?feed=animal&format=rss
```

---

### 4. **WHO Disease Outbreak News**
**World Health Organization**

- **Website:** https://www.who.int/emergencies/disease-outbreak-news
- **API:** https://www.who.int/api
- **Focus:** Primarily human diseases, but includes zoonotic diseases
- **Update Frequency:** As events occur

---

## 🔧 Implementation Options

### Option 1: Automated WAHIS Sync (Advanced)
**Status:** ⚠️ Requires reverse-engineering or official API access

The `wahis.service.ts` file I created provides a framework for:
1. Fetching outbreak data from WAHIS
2. Mapping disease names to your internal types
3. Calculating severity based on affected animals
4. Storing in your PostgreSQL database

**To use:**
```bash
# Manually trigger sync
POST http://localhost:5000/api/v1/sync
Authorization: Bearer <your-token>
```

**Limitations:**
- WAHIS doesn't have a well-documented public API
- You may need to inspect their web app's network requests
- Consider requesting official API access from WOAH

---

### Option 2: CSV Import from Kaggle (Simple & Reliable)
**Status:** ✅ Ready to use

**Steps:**
1. Download dataset from Kaggle:
   - https://www.kaggle.com/datasets/fao/animal-disease-outbreaks
   
2. Create import script:
```typescript
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import prisma from './utils/prisma';

const importCSV = async () => {
  const csvData = fs.readFileSync('outbreaks.csv', 'utf-8');
  const records = parse(csvData, { columns: true });

  for (const record of records) {
    await prisma.outbreak.create({
      data: {
        name: `${record.disease} - ${record.country}`,
        type: mapDiseaseType(record.disease),
        latitude: parseFloat(record.latitude),
        longitude: parseFloat(record.longitude),
        severity: calculateSeverity(parseInt(record.cases)),
        date: new Date(record.date),
        affectedAnimals: parseInt(record.cases),
        riskRadius: 25,
      },
    });
  }
};
```

3. Run import:
```bash
npx ts-node scripts/import-outbreaks.ts
```

---

### Option 3: ProMED RSS Feed (Moderate Complexity)
**Status:** ✅ Feasible with RSS parser

**Steps:**
1. Install RSS parser:
```bash
npm install rss-parser
```

2. Create ProMED service:
```typescript
import Parser from 'rss-parser';

const parser = new Parser();

export const fetchProMEDOutbreaks = async () => {
  const feed = await parser.parseURL('https://promedmail.org/ajax/runSearch.php?feed=animal&format=rss');
  
  for (const item of feed.items) {
    // Parse item.title and item.content
    // Extract location, disease, date
    // Store in database
  }
};
```

---

### Option 4: Manual Curation (Most Reliable)
**Status:** ✅ Recommended for production

**Steps:**
1. Subscribe to official outbreak notifications:
   - WOAH email alerts: https://wahis.woah.org
   - FAO EMPRES alerts: https://empres-i.apps.fao.org
   - ProMED subscriptions: https://promedmail.org

2. Manually add outbreaks via Prisma Studio or admin panel:
```bash
npx prisma studio
```

3. Create admin UI for adding outbreaks (future enhancement)

---

## 🚀 Recommended Approach

### For Development/Testing:
Use **Option 2 (CSV Import)** - Download Kaggle dataset and import once

### For Production:
Combine:
- **Option 4 (Manual Curation)** for critical/verified outbreaks
- **Option 3 (ProMED RSS)** for automated daily updates
- **Option 1 (WAHIS)** if you can get official API access

---

## 📅 Automated Syncing with Cron Jobs

### Using node-cron (Simple)
```bash
npm install node-cron
```

```typescript
import cron from 'node-cron';
import { syncWAHISData } from './services/wahis.service';

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily outbreak sync...');
  await syncWAHISData();
});
```

### Using System Cron (Production)
```bash
# Edit crontab
crontab -e

# Add line to run sync daily at 2 AM
0 2 * * * cd /path/to/backend && npx ts-node scripts/sync-outbreaks.ts
```

---

## 🔍 Data Quality Considerations

### Geocoding
Many outbreak reports don't include exact coordinates. You'll need to:
1. Use a geocoding service (Google Maps API, OpenCage, Nominatim)
2. Convert "City, Country" to lat/lng
3. Store approximate locations

### Disease Name Mapping
Different sources use different disease names:
- "HPAI" vs "H5N1" vs "Avian Influenza"
- Create a comprehensive mapping dictionary

### Deduplication
Prevent duplicate outbreaks by:
- Checking unique identifiers (report ID)
- Comparing location + disease + date
- Using fuzzy matching for similar reports

---

## 📊 Sample Implementation

I've created a working framework in:
- `backend/src/services/wahis.service.ts` - WAHIS integration
- `backend/src/routes/v1/sync.routes.ts` - Manual sync endpoint

**To test:**
```bash
# 1. Ensure backend is running
cd backend
npm run dev

# 2. Trigger manual sync (will attempt to fetch from WAHIS)
curl -X POST http://localhost:5000/api/v1/sync \
  -H "Authorization: Bearer <your-token>"
```

---

## 🎯 Next Steps

1. **Choose your data source** based on your needs
2. **Implement the integration** using one of the options above
3. **Set up automated syncing** with cron jobs
4. **Add geocoding** for reports without coordinates
5. **Implement deduplication** to avoid duplicate outbreaks
6. **Monitor data quality** and adjust mappings as needed

---

## 📚 Additional Resources

- WOAH WAHIS: https://wahis.woah.org
- FAO EMPRES-i+: https://empres-i.apps.fao.org
- ProMED-mail: https://promedmail.org
- WHO Disease Outbreak News: https://www.who.int/emergencies/disease-outbreak-news
- Kaggle Animal Disease Datasets: https://www.kaggle.com/search?q=animal+disease

---

## ⚠️ Important Notes

1. **API Rate Limits:** Respect rate limits of any public APIs you use
2. **Data Licensing:** Check data usage terms for each source
3. **Accuracy:** Always verify critical outbreak information from official sources
4. **Privacy:** Don't store personally identifiable information
5. **Caching:** Cache API responses to reduce unnecessary requests

---

## 🆘 Support

If you need help with:
- Official WOAH API access: Contact WOAH directly
- Kaggle dataset issues: Check Kaggle forums
- ProMED RSS parsing: Refer to rss-parser documentation
