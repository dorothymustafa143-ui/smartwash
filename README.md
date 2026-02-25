# 🧺 SmartWash – Campus Laundry Made Easy

A mobile-first React + TypeScript web application for managing campus laundry services.

## Features

### Student Portal
- **Register/Login** with student credentials
- **Request Laundry Service** (Wash Only, Wash & Dry, Wash+Dry+Iron, Dry Clean)
- **Delivery preference** – room delivery or self-pickup
- **Track Order** with live step-by-step progress
- **Order History** with filtering (Active, Completed, Cancelled)
- **Submit Feedback** with star ratings
- **Profile page** with order stats

### Admin / Manager Portal
- **Dashboard** with real-time stats (pending, in-progress, ready, delivered)
- **All Orders** with search and status filters
- **Update Order Status** directly from order detail page
- **Manage Time Slots** – create, view, and delete pickup slots
- **View Feedback** with rating breakdown

## Tech Stack
- **React 18** + **TypeScript**
- **React Router v6** for navigation
- **Vite** for fast dev/build
- **Lucide React** for icons
- **Google Fonts** (Sora + DM Sans)
- **No CSS frameworks** – fully custom CSS with CSS variables

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open http://localhost:5173

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | john@student.edu | (any) |
| Student | grace@student.edu | (any) |
| Admin | admin@smartwash.com | (any) |

> Note: Passwords are not validated in the demo – any password will work. Implement proper authentication before production use.

## Project Structure

```
src/
├── components/          # Shared components (nav bars, order card)
├── context/             # App-wide state management (AppContext)
├── data/                # Mock data for demo
├── pages/
│   ├── admin/           # Admin pages (Dashboard, Orders, TimeSlots, Feedback)
│   └── student/         # Student pages (Dashboard, Request, Orders, Track, Profile)
├── types/               # TypeScript interfaces
├── App.tsx              # Routing setup
├── main.tsx             # Entry point
└── index.css            # Global styles + design tokens
```

## Color Palette

| Token | Value | Use |
|-------|-------|-----|
| `--blue` | `#1E3A8A` | Primary, trust |
| `--aqua` | `#06B6D4` | Accent, water/clean |
| `--success` | `#10B981` | Completed states |
| `--danger` | `#EF4444` | Cancellations, alerts |

## Notes for Production
1. Replace mock data with a real API/backend
2. Implement proper JWT authentication
3. Add push notifications for order status updates
4. Add payment integration for booking fees
5. Connect to a real database (Supabase, Firebase, etc.)
