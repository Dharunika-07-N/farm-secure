# 🛡️ Farm-Secure: Comprehensive Biosecurity Management Platform

A full-stack farm biosecurity management system designed to help farmers monitor, manage, and maintain biosecurity protocols across their operations.

## 🌟 Features

### Core Functionality
- **🔐 Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **📊 Dashboard**: Real-time overview of farm biosecurity metrics, alerts, and compliance status
- **🐄 Livestock Management**: Track batches, mortality records, and movement logs
- **🌾 Crop Management**: Monitor crop health, yields, and agricultural activities
- **👥 Visitor Management**: Log and track all farm visitors with entry/exit records
- **👷 Staff Management**: Manage farm staff, roles, and training assignments
- **📦 Inventory Management**: Track supplies, equipment, and biosecurity materials
- **💰 Financial Transactions**: Record and categorize farm income and expenses

### Biosecurity Features
- **⚠️ Alert System**: Real-time notifications for biosecurity threats and compliance issues
- **🎯 Risk Assessment**: Comprehensive biosecurity risk evaluation tool
- **📋 Compliance Tracking**: Monitor adherence to biosecurity standards and regulations
- **🗺️ Disease Mapping**: Visualize disease outbreaks and risk zones on interactive maps
- **🌡️ Weather Integration**: Real-time weather data to assess environmental risks
- **📚 Training Modules**: Assign and track staff biosecurity training

### Analytics & Reporting
- **📈 Analytics Dashboard**: Detailed insights into farm operations and biosecurity metrics
- **📄 PDF Reports**: Generate professional compliance and risk assessment reports
- **📊 Data Visualization**: Charts and graphs for trend analysis
- **🌍 Multi-language Support**: Interface available in multiple languages (i18n ready)

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Hooks
- **Routing**: React Router v6
- **Maps**: Leaflet, React-Leaflet
- **Charts**: Recharts
- **PDF Generation**: jsPDF, jspdf-autotable
- **HTTP Client**: Axios
- **Internationalization**: i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Caching**: Redis
- **Validation**: Zod
- **File Uploads**: Multer
- **Security**: Helmet, CORS
- **Email**: Nodemailer
- **External APIs**: OpenWeatherMap, Google Maps

## 📁 Project Structure

```
farm-secure/
├── backend/                 # Backend API server
│   ├── prisma/             # Database schema and migrations
│   ├── scripts/            # Utility scripts for data import
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Input validation schemas
│   └── server.ts           # Application entry point
│
├── frontend/               # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── assessment/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   ├── training/
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Helper functions
│   │   └── App.tsx        # Main application component
│   └── index.html
│
└── data/                  # Sample data and import scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **npm**: v9 or later
- **PostgreSQL**: v14 or later
- **Redis**: v6 or later (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm-secure
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your configuration
   # - Database credentials
   # - JWT secrets
   # - API keys (OpenWeatherMap, Google Maps)
   # - Email configuration
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed database with sample data
   npm run seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Update API endpoint in src/lib/api.ts if needed
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or use demo credentials (if seeded)

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/farmsecure"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="your-refresh-secret"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Frontend
FRONTEND_URL="http://localhost:5173"

# APIs
OPENWEATHER_API_KEY="your-api-key"
GOOGLE_MAPS_API_KEY="your-api-key"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@farmsecure.com"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"
```

### Frontend Configuration

Update `src/lib/api.ts` to point to your backend:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Farm Management
- `GET /api/v1/farms` - List all farms
- `POST /api/v1/farms` - Create new farm
- `GET /api/v1/farms/:id` - Get farm details
- `PUT /api/v1/farms/:id` - Update farm

### Livestock
- `GET /api/v1/livestock/:farmId/batches` - Get livestock batches
- `POST /api/v1/livestock/:farmId/batches` - Create batch
- `POST /api/v1/livestock/:batchId/mortality` - Record mortality
- `POST /api/v1/livestock/:batchId/movement` - Record movement

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data

### Risk Assessment
- `POST /api/v1/risk-assessment` - Submit risk assessment
- `GET /api/v1/risk-assessment` - Get assessment history

### And many more... (See individual route files for complete API reference)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🏭 Production Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred web server
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Helmet.js for HTTP security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention via Prisma ORM
- Rate limiting (configurable)
- File upload restrictions

## 🌍 Internationalization

The application supports multiple languages using i18next. Language files are located in `frontend/src/locales/`.

To add a new language:
1. Create a new JSON file in `src/locales/`
2. Add translations
3. Update `src/i18n.ts` to include the new language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- OpenWeatherMap for weather data API
- Google Maps for geocoding services
- shadcn/ui for beautiful UI components
- Radix UI for accessible component primitives
- The open-source community

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for farmers and agricultural communities**
