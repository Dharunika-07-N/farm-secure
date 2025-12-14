# 🌍 Real-Time Outbreak Data - Quick Start Guide

## ✅ What's Been Set Up

I've integrated **ProMED-mail**, a free, reliable source for real-time animal disease outbreak data!

### What is ProMED?
- **Program for Monitoring Emerging Diseases**
- Free, public health surveillance system
- Daily updates on disease outbreaks worldwide
- Covers animal diseases, zoonoses, and human diseases
- Used by WHO, CDC, and health organizations globally

---

## 🚀 How to Use It

### Step 1: Restart Your Backend
The new code needs to load:
```bash
# Stop current backend (Ctrl+C)
cd backend
npm run dev
```

### Step 2: Trigger Data Sync
Use this API endpoint to fetch real outbreak data:

```bash
POST http://localhost:5000/api/v1/sync/promed
Authorization: Bearer <your-jwt-token>
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/v1/sync/promed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Using Postman:**
1. Create new POST request
2. URL: `http://localhost:5000/api/v1/sync/promed`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Send!

### Step 3: View the Results
After syncing, check your disease map:
- Go to `http://localhost:5173/disease-map`
- You should see NEW outbreak markers from real ProMED data!

---

## 📊 What Data Gets Synced

The ProMED service will:
1. ✅ Fetch the 20 most recent animal disease reports
2. ✅ Extract disease type (Avian Influenza, ASF, Newcastle, FMD)
3. ✅ Extract country/location from report titles
4. ✅ Geocode to GPS coordinates (using country capitals)
5. ✅ Store in your PostgreSQL database
6. ✅ Skip duplicates automatically

**Example ProMED Report:**
```
Title: "Avian Influenza (H5N1) - India (Karnataka)"
→ Becomes:
{
  name: "Avian Influenza (H5N1) - India (Karnataka)",
  type: "avian_influenza",
  latitude: 20.5937,
  longitude: 78.9629,
  severity: "medium",
  date: "2024-01-15",
  riskRadius: 30
}
```

---

## 🔄 Automated Syncing (Optional)

### Option 1: Manual Sync (Current Setup)
- Call the API endpoint whenever you want fresh data
- Good for development and testing

### Option 2: Scheduled Sync (Recommended for Production)
Add this to your `backend/src/server.ts`:

```typescript
import cron from 'node-cron';
import { syncProMEDData } from './services/promed.service';

// Sync ProMED data every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily ProMED sync...');
  try {
    await syncProMEDData();
  } catch (error) {
    console.error('ProMED sync failed:', error);
  }
});
```

Then install node-cron:
```bash
npm install node-cron
npm install --save-dev @types/node-cron
```

---

## 🎯 Testing the Integration

### Test 1: Check if ProMED is accessible
```bash
curl https://promedmail.org/ajax/runSearch.php?feed=animal&format=rss
```
You should see XML/RSS data.

### Test 2: Sync data
```bash
# Login first to get token
POST http://localhost:5000/api/v1/auth/login
{
  "email": "farmer@example.com",
  "password": "password123"
}

# Copy the token from response, then:
POST http://localhost:5000/api/v1/sync/promed
Authorization: Bearer <token>
```

### Test 3: Verify data in database
```bash
cd backend
npx prisma studio
```
Open `Outbreak` table - you should see new records!

### Test 4: View on map
Go to `http://localhost:5173/disease-map` - new markers should appear!

---

## 📈 Expected Results

After running sync, you should see:
```json
{
  "success": true,
  "message": "ProMED data sync completed",
  "synced": 15,
  "skipped": 5,
  "errors": 0
}
```

- **synced**: New outbreaks added to database
- **skipped**: Duplicates or reports without coordinates
- **errors**: Failed to process (should be 0)

---

## 🔧 Customization Options

### Add More Countries to Geocoding
Edit `backend/src/services/promed.service.ts`:
```typescript
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  'YourCountry': { lat: XX.XXXX, lng: YY.YYYY },
  // Add more countries here
};
```

### Adjust Sync Frequency
Change the cron schedule:
- `'0 */6 * * *'` - Every 6 hours
- `'0 0 * * *'` - Daily at midnight
- `'0 2 * * 1'` - Every Monday at 2 AM

### Filter by Disease Type
Modify `syncProMEDData()` to only sync specific diseases:
```typescript
if (diseaseType !== 'avian_influenza') {
  continue; // Skip non-avian flu reports
}
```

---

## 🌟 Advantages of ProMED

✅ **Free** - No API keys or subscriptions needed
✅ **Reliable** - Used by major health organizations
✅ **Real-time** - Updated daily with new reports
✅ **Global** - Covers 190+ countries
✅ **Accessible** - Simple RSS feed, no authentication
✅ **Comprehensive** - Includes context and details in reports

---

## 🔮 Future Enhancements

1. **Better Geocoding**
   - Use Google Maps Geocoding API
   - Or OpenCage, Nominatim for free alternatives
   - Get exact city/region coordinates instead of country centers

2. **NLP for Severity**
   - Analyze report text to determine severity
   - Keywords like "massive outbreak" → high severity
   - "suspected case" → low severity

3. **Extract Affected Animals Count**
   - Parse report content for numbers
   - "5,000 birds culled" → affectedAnimals: 5000

4. **Multi-Source Aggregation**
   - Combine ProMED + WAHIS + FAO data
   - Deduplicate across sources
   - Provide most comprehensive coverage

5. **Alert System**
   - Notify users when outbreak detected near their farm
   - Email/SMS alerts for high-severity outbreaks
   - Push notifications in mobile app

---

## 📚 Additional Resources

- **ProMED Website:** https://promedmail.org
- **RSS Feed:** https://promedmail.org/ajax/runSearch.php?feed=animal&format=rss
- **About ProMED:** https://promedmail.org/aboutus/
- **Subscribe to Email Alerts:** https://promedmail.org/subscribe/

---

## 🆘 Troubleshooting

### "Failed to fetch RSS feed"
- Check internet connection
- ProMED might be temporarily down
- Try again in a few minutes

### "No coordinates for country"
- Add the country to `countryCoordinates` in `promed.service.ts`
- Or use a geocoding API

### "All reports skipped"
- Might be duplicates (already in database)
- Check Prisma Studio to see existing outbreaks
- Try clearing old data: `DELETE FROM "Outbreak" WHERE ...`

### "Sync endpoint returns 401"
- You need to be logged in
- Include valid JWT token in Authorization header
- Get token from `/api/v1/auth/login`

---

## ✅ Summary

You now have:
- ✅ Real-time disease outbreak data from ProMED
- ✅ API endpoint to sync data: `POST /api/v1/sync/promed`
- ✅ Automatic geocoding and disease type mapping
- ✅ Duplicate detection
- ✅ Integration with your existing map

**Next step:** Restart backend and try syncing!

```bash
cd backend
npm run dev

# In another terminal or Postman:
POST http://localhost:5000/api/v1/sync/promed
```

Enjoy your real-time outbreak tracking! 🎉
