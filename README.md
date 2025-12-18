# Chef Origin (Client)

## Purpose

Chef Origin is a comprehensive food delivery and chef hiring platform designed to connect talented chefs with food enthusiasts. The client-side application provides an intuitive interface for users to discover meals, place orders, and for chefs to manage their culinary offerings. It features role-based access control, ensuring a tailored experience for Admins, Chefs, and regular Users.

## Live URL

https://chef-origin.web.app/

## Key Features

- **Authentication & Authorization:** Secure login and registration using Firebase Authentication with JWT-based session management.
- **Role-Based Dashboards:**
  - **User:** Browse meals, manage orders, view favorites, and leave reviews.
  - **Chef:** Add and manage meals, view order requests, and track sales.
  - **Admin:** Manage users, approve chef requests, and view platform statistics.
- **Meal Discovery:** Browse a wide variety of meals with detailed descriptions, ingredients, and chef information.
- **Ordering System:** Seamless ordering process with cart management and secure checkout.
- **Payment Integration:** Integrated Stripe for secure and reliable payment processing.
- **Reviews & Ratings:** Users can rate and review meals, helping others make informed decisions.
- **Responsive Design:** Fully responsive UI built with Tailwind CSS and DaisyUI, ensuring a great experience on all devices.
- **Interactive UI:** Smooth animations using Framer Motion and Lottie React.
- **Data Visualization:** Visual statistics for admins using Recharts.

## NPM Packages Used

- **Core:** `react`, `react-dom`, `react-router`
- **Styling:** `tailwindcss`, `daisyui`, `framer-motion`
- **State Management & Data Fetching:** `zustand`, `@tanstack/react-query`, `axios`
- **Forms & Validation:** `react-hook-form`
- **Authentication & Backend Integration:** `firebase`
- **Payment:** `@stripe/stripe-js`
- **Image Handling:** `@imagekit/react`
- **UI Components & Icons:** `react-icons`, `react-hot-toast`, `lottie-react`, `recharts`

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up environment variables (Firebase config, Stripe key, ImageKit config).
4.  Run the development server: `npm run dev`
