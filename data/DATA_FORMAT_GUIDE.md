# Data Format Guide for Real-World Data Import

This guide explains the JSON formats expected by the import script (`backend/scripts/import-realworld-data.ts`).
Place your data files in `data/raw/` with the filenames specified below.

## 1. ASF Mortality Data
**Filename:** `asf_mortality_data.json`

Format: Array of objects or a single object with state names as keys.

```json
[
  {
    "state": "Assam",
    "2023_died": 500,
    "2023_culled": 1200
  },
  {
    "State/ UT": "Nagaland",
    "2023 - Died": 300,
    "2023 - Culled": 800
  }
]
```

## 2. Livestock Census Data
**Filename:** `livestock_census_data.json`

Format: Array of objects representing census records.

```json
[
  {
    "state": "Kerala",
    "district": "Wayanad",
    "pigs": 5000,
    "poultry": 25000,
    "cattle": 10000
  }
]
```

## 3. DAHD Surveillance Data
**Filename:** `dahd_surveillance_data.json`

Format: Array of disease outbreak reports.

```json
[
  {
    "disease": "African Swine Fever",
    "location": "Mizoram",
    "date": "2023-11-15",
    "cases": 45
  },
  {
    "Disease": "Lumpy Skin Disease",
    "State": "Gujarat",
    "reportDate": "2023-08-20",
    "affected": 120
  }
]
```

## 4. Custom Farm Data
**Filename:** `custom_farm_data.json`

Format: Array of farm profiles to import.

```json
[
  {
    "name": "Green Valley Farm",
    "location": "Assam",
    "latitude": 26.2006,
    "longitude": 92.9376,
    "livestockType": "Pig",
    "animalCount": 200,
    "size": 10,
    "description": "Commercial pig farm with high biosecurity",
    "infrastructure": {
      "fencing": true,
      "quarantine_zone": true
    }
  }
]
```
