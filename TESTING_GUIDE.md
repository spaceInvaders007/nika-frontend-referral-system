# 🧪 Referral System Testing Guide

## Overview
This guide walks through testing the complete referral system functionality, including user registration, referral code sharing, multi-level referral networks, and commission tracking.

## Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:3001`
- Browser with developer tools open (for console logs and network inspection)

---

## 🚀 Step 1: Initial Setup

### 1.1 Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 1.2 Access the Application
- Open browser to `http://localhost:3001`
- You should see the login page

---

## 👤 Step 2: Create First User (Referrer)

### 2.1 Register User A
1. **Click "Sign Up"** on the login page
2. **Fill in registration form:**
   - Email: `userA@example.com`
   - Password: `password123`
   - Name: `User A`
   - **Leave referral code empty** (this is the root user)
3. **Click "Sign Up"**
4. **Verify:** You should be logged in and see the dashboard

### 2.2 Get Referral Code
1. **Navigate to "Referral Link"** in the sidebar
2. **Click "Generate Code"** if no code exists
3. **Copy the referral code** (e.g., `ABC12345`)
4. **Note the referral link** (e.g., `http://localhost:3001/auth?ref=ABC12345`)

---

## 👥 Step 3: Create Second User (First Level Referral)

### 3.1 Register User B with Referral Code
1. **Open a new incognito/private browser window**
2. **Navigate to:** `http://localhost:3001/auth?ref=ABC12345`
3. **Click "Sign Up"**
4. **Fill in registration form:**
   - Email: `userB@example.com`
   - Password: `password123`
   - Name: `User B`
   - **Referral code should be pre-filled** with `ABC12345`
5. **Click "Sign Up"**
6. **Verify:** User B is logged in and sees their own dashboard

### 3.2 Get User B's Referral Code
1. **Navigate to "Referral Link"** in User B's dashboard
2. **Click "Generate Code"** if no code exists
3. **Copy User B's referral code** (e.g., `XYZ78901`)

### 3.3 Verify Cashback Benefits
1. **Check User B's Dashboard** - should show a green "🎉 You're Earning Cashback!" card
2. **Navigate to "Settings"** → "Profile" tab
3. **Verify "Cashback Benefits"** section shows "10.0% Trading Fee Cashback"
4. **Note:** For demo purposes, users with emails containing "test" or "dani" will show 10% cashback
5. **Note:** User A (referrer) won't see cashback since they weren't referred by anyone

---

## 💰 Step 4: Test Commission Generation

### 4.1 Simulate Trades for User B (Generates Commissions for User A)
1. **Stay logged in as User B**
2. **Navigate to "API Tester"** in the sidebar
3. **In the "Test User ID" field, enter User B's ID:**
   - You can find this in the browser's developer tools:
     - Open DevTools (F12)
     - Go to Application/Storage → Local Storage
     - Look for `authToken` and decode the JWT to get the user ID
   - Or use the default logged-in user ID
4. **Set trade parameters:**
   - Volume: `1000`
   - Fees: `10`
5. **Click "Simulate Trade"**
6. **Verify:** You should see "Trade simulated successfully!"

### 4.2 Check User A's Earnings
1. **Switch back to User A's browser window**
2. **Refresh the dashboard**
3. **Verify earnings appear:**
   - **Total Earnings** should show a positive amount (e.g., $3.00)
   - **This Month** should match Total Earnings
   - **Pending Claims** should match Total Earnings

### 4.3 View Detailed Earnings
1. **Navigate to "Earnings"** tab
2. **Verify the breakdown table shows:**
   - User B's email (`userB@example.com`)
   - Level 1 commission
   - Amount earned (e.g., $3.00)
   - Status: "Pending"

---

## 🌐 Step 5: Test Multi-Level Referral Network

### 5.1 Create Third User (Second Level Referral)
1. **Open another incognito/private browser window**
2. **Navigate to:** `http://localhost:3001/auth?ref=XYZ78901` (User B's code)
3. **Register User C:**
   - Email: `userC@example.com`
   - Password: `password123`
   - Name: `User C`
   - Referral code should be pre-filled with `XYZ78901`

### 5.2 Test Second Level Commissions
1. **Stay logged in as User C**
2. **Navigate to "API Tester"**
3. **Simulate a trade for User C:**
   - Use User C's ID (or default logged-in user)
   - Volume: `2000`
   - Fees: `20`
4. **Click "Simulate Trade"**

### 5.3 Verify Multi-Level Commissions
1. **Switch to User A's browser**
2. **Refresh the dashboard**
3. **Check earnings increased** (should see additional commission from User C)
4. **Navigate to "Network" tab**
5. **Verify the referral tree shows:**
   - User A (root)
   - └── User B (Level 1)
   -     └── User C (Level 2)

---

## 📊 Step 6: Test Network Visualization

### 6.1 View Referral Network
1. **In User A's dashboard, navigate to "Network"**
2. **Verify the network tree displays:**
   - **Total Referrals:** 2 (User B and User C)
   - **Level 1:** User B
   - **Level 2:** User C
3. **Test search functionality:**
   - Search for "userB" - should filter to show User B
   - Search for "userC" - should filter to show User C

### 6.2 Test Pagination (if applicable)
- If you have many referrals, test the pagination controls
- Verify page navigation works correctly

---

## 📋 Test Data Summary

After completing all tests, you should have:

### Users Created:
- **User A** (`userA@example.com`) - Root referrer
- **User B** (`userB@example.com`) - Level 1 referral of User A
- **User C** (`userC@example.com`) - Level 2 referral of User B

### Referral Network:
```
User A (Root)
├── User B (Level 1) - Referred by User A
    └── User C (Level 2) - Referred by User B
```

### Expected Commissions:
- **User A** earns from both User B and User C trades
- **User B** earns from User C trades only
- **User C** earns nothing (no referrals)

### Commission Structure:
- **Level 1 (Direct):** 30% of trading fees
- **Level 2 (Referral's Referral):** 3% of trading fees
- **Level 3 (Third Level):** 2% of trading fees

### Cashback Benefits:
- **Referred Users:** 10% cashback on all trading fees
- **Referrers:** No cashback (they earn commissions instead)
- **Display:** Cashback shown in Dashboard and Settings pages

---






