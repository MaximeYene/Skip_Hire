Skip Hire Booking Project

This project is a modern, responsive web application that simulates a complete skip hire booking process. The app guides users through a multi-step journey—from entering a postcode to reaching the payment page—offering a smooth and intuitive user experience.

✨ Key Features
Multi-Step User Journey: A step-by-step "wizard" guides the user through the process, with a clear progress indicator.

Location Search: Integration of the postcodes.io API for autocomplete and validation of UK postcodes.

Smart Waste Selection: A waste selection system that triggers conditional logic for heavy waste or plasterboard via an interactive drawer panel.

Skip Catalogue: Displays available skip sizes with their details (price, rental duration, permit requirements, etc.).

Permit Check: The interface adapts based on the selected location (private or public) and skip type, informing the user if a permit is required.

Date Selection: A custom calendar allows the selection of delivery and collection dates, disables weekends, and calculates a default collection date.

Order Summary and Payment: The final step summarizes the order and displays a secure payment form.

Modern & Responsive Design: Fully mobile-first, the UI is sleek and works seamlessly across all devices.

Dark Theme: A consistent dark-mode interface for a modern and professional look.

🛠️ Tech Stack
Framework: React (via Next.js)

Language: TypeScript

UI Library: Material-UI (MUI) for advanced components (Cards, Buttons, Drawers, etc.)

CSS Framework: Tailwind CSS for layout, grid, and utility-first styling

Animations: Framer Motion for smooth transitions and animations

Icons: Lucide React for lightweight and consistent icons

External API: Postcodes.io for geolocation data

🏛️ Architecture and Key Concepts
1. Wizard Architecture (Step-by-Step Assistant)
The core of the app is a sequential booking process. Each step is encapsulated in its own React component:

Home.tsx → WasteTypeSelector.tsx → SelectSkip.tsx → PermitCheck.tsx → ChooseDate.tsx → Payments.tsx

The StepperDemo component serves as the visual container to show the user's progress.

2. Client-Side State Management
User selections are preserved between steps using browser localStorage, avoiding the need for complex state libraries like Redux.

Example: When a skip is selected in SelectSkip.tsx, the skip object is stored as JSON in localStorage.

Pros: Simple and effective client-only solution. The user's progress persists even after refreshing the page.

Cons: Data is not stored on a server and is limited to the user’s browser.

3. Hybrid Styling Approach
This project demonstrates a modern styling approach using the best of both worlds:

Material-UI (MUI) for prebuilt components and theming (Cards, Buttons, Drawers, Alerts, etc.). A dark theme (darkTheme) is defined once and applied globally.

Tailwind CSS is used for layout (Flexbox, Grid), spacing, and quick utility classes.

This combo allows rapid prototyping with complex components while maintaining full control over layout and design details.

4. Reusable and Conditional Components
The project highlights the power of React composition:

Calendar.tsx: A pure, reusable calendar component that receives all props (like displayMonth, selectedDate, onDateSelect) and is used twice in ChooseDate.tsx (for delivery and collection).

Conditional Logic: Many components render differently based on prior choices. For example, PermitCheck.tsx disables the "Public Road" option if the selected skip from SelectSkip.tsx doesn’t support it.

📂 Component Breakdown
Home.tsx: Landing page and entry point. Handles postcode search with autocomplete and address fetching via API.

WasteTypeSelector.tsx: Lets users select waste types. Contains advanced logic in a MUI Drawer to manage heavy waste and plasterboard selection.

SelectSkip.tsx: Displays a grid of available skips (loaded from a local JSON file). Users can compare and select the right skip.

PermitCheck.tsx: Key step to determine if a permit is needed. Highly conditional UI with an optional photo upload step.

ChooseDate.tsx: Displays two instances of the calendar component for delivery and collection dates, with logic to disable weekends.

Payments.tsx: Final step. Retrieves all user selections from localStorage and shows a complete order summary with a mock payment form.

Calendar.tsx: Reusable calendar component designed to be controlled by a parent component.

🚀 Quick Start
To run this project locally, follow these steps:

Clone the repo:
git clone https://github.com/your-name/your-repo.git
cd your-repo

Install dependencies:
npm install

Start the development server:
npm run dev
