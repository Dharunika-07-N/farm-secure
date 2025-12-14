# 📮 Postman Guide - Getting Your Auth Token & Syncing Data

## Step-by-Step Tutorial

---

## 🔐 Step 1: Login to Get Your Token

### 1. Open Postman
- Download from https://www.postman.com/downloads/ if you don't have it
- Or use the web version at https://web.postman.com

### 2. Create a New Request
- Click **"New"** → **"HTTP Request"**
- Or click the **"+"** tab

### 3. Configure the Login Request

**Method:** `POST`
**URL:** `http://localhost:5000/api/v1/auth/login`

### 4. Set Request Body
1. Click the **"Body"** tab (below the URL bar)
2. Select **"raw"** radio button
3. Select **"JSON"** from the dropdown (on the right)
4. Paste this JSON:

```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

### 5. Send the Request
- Click the blue **"Send"** button
- Wait for the response (should be instant)

### 6. Copy Your Token
You'll get a response like this:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "abc123...",
    "email": "farmer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FARMER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMxMjMiLCJyb2xlIjoiRkFSTUVSIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDE2MDAwMDB9.abc123xyz..."
}
```

**IMPORTANT:** Copy the entire `token` value (the long string starting with `eyJ...`)

---

## 🌍 Step 2: Sync Outbreak Data from ProMED

### 1. Create Another New Request
- Click **"New"** → **"HTTP Request"**
- Or click the **"+"** tab

### 2. Configure the Sync Request

**Method:** `POST`
**URL:** `http://localhost:5000/api/v1/sync/promed`

### 3. Add Authorization Header
1. Click the **"Headers"** tab (below the URL bar)
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE`
   
   **IMPORTANT:** Replace `YOUR_TOKEN_HERE` with the token you copied from Step 1
   
   **Example:**
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMxMjMiLCJyb2xlIjoiRkFSTUVSIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDE2MDAwMDB9.abc123xyz...
   ```
   
   **Note:** There must be a space between `Bearer` and the token!

3. Make sure the checkbox next to the header is **checked** ✅

### 4. Send the Request
- Click the blue **"Send"** button
- This will take 5-10 seconds (fetching real data from ProMED)

### 5. Check the Response
You should get:

```json
{
  "success": true,
  "message": "ProMED data sync completed",
  "synced": 15,
  "skipped": 5,
  "errors": 0
}
```

**What this means:**
- `synced: 15` → 15 new outbreaks added to your database
- `skipped: 5` → 5 duplicates or reports without coordinates
- `errors: 0` → No errors (good!)

---

## ✅ Verify the Data

### Option 1: Check Database
```bash
cd backend
npx prisma studio
```
- Open the **Outbreak** table
- You should see new records!

### Option 2: Check the Map
- Go to `http://localhost:5173/disease-map`
- You should see new outbreak markers on the map!

### Option 3: Check via API
Create a new GET request in Postman:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/outbreaks`
- **Headers:** `Authorization: Bearer YOUR_TOKEN`
- Click **Send**

You'll get an array of all outbreaks in your database.

---

## 🔄 Save Your Requests in Postman

### Create a Collection
1. Click **"Collections"** in the left sidebar
2. Click **"+"** to create a new collection
3. Name it **"Farm-Secure API"**

### Save Requests
1. For each request, click the **"Save"** button (top right)
2. Choose the **"Farm-Secure API"** collection
3. Give it a name:
   - "Login"
   - "Sync ProMED Data"
   - "Get Outbreaks"

### Set Collection Variables (Advanced)
1. Click on your collection → **"Variables"** tab
2. Add variables:
   - `base_url` = `http://localhost:5000/api/v1`
   - `token` = (leave empty for now)

3. Update your requests to use variables:
   - URL: `{{base_url}}/auth/login`
   - Header: `Bearer {{token}}`

4. After login, manually copy the token to the collection variable

---

## 🎯 Quick Reference

### Login Request
```
POST http://localhost:5000/api/v1/auth/login
Body (JSON):
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

### Sync ProMED Request
```
POST http://localhost:5000/api/v1/sync/promed
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Outbreaks Request
```
GET http://localhost:5000/api/v1/outbreaks
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Dashboard Request
```
GET http://localhost:5000/api/v1/dashboard
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🆘 Troubleshooting

### "Cannot POST /api/v1/auth/login"
- ✅ Check backend is running: `npm run dev` in backend folder
- ✅ Check URL is exactly: `http://localhost:5000/api/v1/auth/login`
- ✅ Check method is **POST** not GET

### "401 Unauthorized"
- ✅ Check you included the Authorization header
- ✅ Check the header value starts with `Bearer ` (with a space)
- ✅ Check the token is complete (no missing characters)
- ✅ Token might be expired - login again to get a new one

### "Incorrect email or password"
- ✅ Check email is exactly: `farmer@example.com`
- ✅ Check password is exactly: `password123`
- ✅ Make sure you ran the seed script: `npx ts-node prisma/seed.ts`

### "Failed to fetch RSS feed"
- ✅ Check your internet connection
- ✅ ProMED might be temporarily down - try again later
- ✅ Check backend logs for detailed error

### "All reports skipped"
- ✅ You might have already synced this data
- ✅ Check Prisma Studio to see existing outbreaks
- ✅ ProMED might not have new reports since last sync

---

## 💡 Pro Tips

### 1. Use Environment Variables
Set up different environments (Development, Production) in Postman:
- Click the environment dropdown (top right)
- Create "Development" environment
- Add `base_url` variable

### 2. Use Pre-request Scripts
Auto-login before each request:
```javascript
// In Collection Pre-request Script
pm.sendRequest({
    url: pm.environment.get("base_url") + "/auth/login",
    method: 'POST',
    header: {'Content-Type': 'application/json'},
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            email: "farmer@example.com",
            password: "password123"
        })
    }
}, function (err, res) {
    pm.environment.set("token", res.json().token);
});
```

### 3. Use Tests
Auto-save token after login:
```javascript
// In Login request Tests tab
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

---

## 📚 Additional Resources

- **Postman Documentation:** https://learning.postman.com/docs/getting-started/introduction/
- **Postman Tutorials:** https://www.youtube.com/c/Postman
- **JWT Debugger:** https://jwt.io (paste your token to see what's inside)

---

## ✅ Summary

1. **Login** → Get token from response
2. **Copy token** → Use in Authorization header
3. **Sync data** → Call `/sync/promed` with token
4. **Verify** → Check database or map

That's it! You now have real outbreak data in your app! 🎉
