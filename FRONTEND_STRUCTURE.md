# Gym Member Management System - Frontend Structure

This is the complete frontend folder structure for the Gym Member Management System built with React, TypeScript, and Tailwind CSS.

```
gym-member-management/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.tsx                    # Admin login form
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx                   # Main dashboard with stats
│   │   │
│   │   ├── layout/
│   │   │   └── Navbar.tsx                      # Navigation component
│   │   │
│   │   ├── members/
│   │   │   ├── MemberManagement.tsx            # Member list and management
│   │   │   └── MemberForm.tsx                  # Add/edit member form
│   │   │
│   │   ├── payments/
│   │   │   ├── PaymentManagement.tsx           # Payment tracking and list
│   │   │   └── PaymentForm.tsx                 # Record payment form
│   │   │
│   │   └── ui/                                 # Shadcn/ui components
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       └── use-toast.ts
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx                      # Mobile detection hook
│   │   └── use-toast.ts                        # Toast notifications hook
│   │
│   ├── lib/
│   │   ├── supabase.ts                         # Supabase client and types
│   │   └── utils.ts                            # Utility functions
│   │
│   ├── pages/
│   │   ├── Index.tsx                           # Main application page
│   │   └── NotFound.tsx                        # 404 page
│   │
│   ├── App.tsx                                 # Root application component
│   ├── App.css                                 # Application styles
│   ├── main.tsx                                # Application entry point
│   ├── index.css                               # Global styles and Tailwind
│   ├── vite-env.d.ts                          # Vite type definitions
│   └── supabaseClient.ts                       # Supabase client configuration
│
├── .env                                        # Environment variables
├── .gitignore                                  # Git ignore rules
├── README.md                                   # Project documentation
├── bun.lockb                                   # Bun lock file
├── components.json                             # Shadcn components config
├── eslint.config.js                           # ESLint configuration
├── index.html                                  # HTML entry point
├── package.json                                # Project dependencies
├── package-lock.json                           # NPM lock file
├── postcss.config.js                          # PostCSS configuration
├── tailwind.config.ts                          # Tailwind CSS configuration
├── tsconfig.app.json                           # TypeScript app config
├── tsconfig.json                               # TypeScript configuration
├── tsconfig.node.json                          # TypeScript Node config
└── vite.config.ts                              # Vite configuration

```

## Key Features Implemented:

### 🏠 **Dashboard (src/components/dashboard/)**
- Total members count
- Fees collected this month
- Pending payments tracking
- New members this month

### 👥 **Member Management (src/components/members/)**
- Add, edit, delete member profiles
- Fields: Name, Age, Contact, Address, Membership dates, Plan type, Emergency contact
- Search and filter functionality

### 💰 **Payment Tracking (src/components/payments/)**
- Record payment date and amount
- Show pending or overdue fees
- Auto-calculate next due date based on plan type
- Payment status management (paid/pending/overdue)

### 🔐 **Authentication (src/components/auth/)**
- Admin login with Supabase authentication
- Secure access to the management system

### 🎨 **UI Components (src/components/ui/)**
- Complete Shadcn/ui component library
- Consistent design system with Tailwind CSS
- Responsive and accessible components

## Technology Stack:
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Shadcn/ui component library
- **State Management**: React hooks and context
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL database, authentication, API)
- **Build Tool**: Vite
- **Package Manager**: Bun/NPM

## Database Tables (Supabase):
1. **members**: Stores member profiles and membership information
2. **payments**: Stores payment records linked to members

This frontend structure provides a complete, production-ready gym management system with modern React patterns and best practices.