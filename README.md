
# Referral System Frontend

A React-based frontend for a commission-based referral system with 3-level cascade structure, custom user types, and real-time earnings tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📋 Available Scripts

### `npm start`
Runs the app in development mode on port 3001.\
The page will reload automatically when you make changes.\
You'll see lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.\
Run `npm test -- --watchAll=false` for a single test run.

### `npm run build`
Builds the app for production to the `build` folder.\
The build is optimized for best performance.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Login/Register forms
│   ├── dashboard/      # Dashboard components
│   └── referral/       # Referral-specific components
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Network.tsx     # Referral network visualization
│   ├── Earnings.tsx    # Earnings breakdown
│   └── Settings.tsx    # User settings
├── services/           # API integration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── contexts/           # React contexts
```

## 🔧 Configuration

### Backend API
The frontend expects the backend API to be running on `http://localhost:3000`. Update the API base URL in `src/config/api.ts` if needed.

### Environment Variables
Create a `.env.local` file in the root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:3000
```

## 🧪 Testing

### Run All Tests
```bash
npm test -- --watchAll=false
```


## 🚀 Production Build

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory and can be served with any static file server.

## 📚 Documentation

- [Testing Guide](TESTING_GUIDE.md) - Comprehensive testing instructions
- [Design Decisions](DESIGN_DECISIONS.md) - Architecture and design rationale

## 🛠️ Troubleshooting

### Common Issues

1. **Port 3001 already in use:**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **API connection errors:**
   - Ensure backend is running on port 3000
   - Check API base URL in configuration

3. **Build errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

