# 🧺 SmartWash – Campus Laundry Made Easy

A mobile-first React + TypeScript web application for managing campus laundry services. Students can book laundry time slots online, track orders in real-time, and submit feedback. Admins manage orders and time slots from a centralized dashboard.

## Features

Student portal:
- Register/login with student credentials
- Request laundry services (Wash Only, Wash + Dry, Wash + Dry + Iron, Dry Clean)
- Delivery preference (room delivery or self-pickup)
- Track order with step-by-step progress
- Order history with filters (Active, Completed, Cancelled)
- Submit feedback with star ratings
- Profile page with order stats

Admin/manager portal:
- Dashboard with real-time stats (pending, in-progress, ready, delivered)
- All orders with search and status filters
- Update order status from order details
- Manage time slots (create, view, delete pickup slots)
- View feedback with rating breakdown

## Tech Stack

- React 18 + TypeScript
- React Router v6
- Vite
- Lucide React
- Google Fonts (Sora, DM Sans)
- Custom CSS (no framework)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | john@student.edu | any |
| Student | grace@student.edu | any |
| Admin | admin@smartwash.com | any |

Note: Passwords are not validated in the demo. Implement authentication for production use.

## Project Structure

```
src/
	components/          Shared components (nav bars, order card)
	context/             App-wide state management (AppContext)
	data/                Mock data for demo
	pages/
		admin/             Admin pages (Dashboard, Orders, TimeSlots, Feedback)
		student/           Student pages (Dashboard, Request, Orders, Track, Profile)
	types/               TypeScript interfaces
	App.tsx              Routing setup
	main.tsx             Entry point
	index.css            Global styles and design tokens
```

## Color Palette

| Token | Value | Use |
| --- | --- | --- |
| --blue | #1E3A8A | Primary, trust |
| --aqua | #06B6D4 | Accent, water/clean |
| --success | #10B981 | Completed states |
| --danger | #EF4444 | Cancellations, alerts |

## Notes for Production

1. Replace mock data with a real API/backend.
2. Implement proper JWT authentication.
3. Add push notifications for order status updates.
4. Add payment integration for booking fees.
5. Connect to a real database (Supabase, Firebase, etc.).
