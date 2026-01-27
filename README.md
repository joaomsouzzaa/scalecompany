# Scale Dashboard (UI Components)

This project contains the **React/TypeScript UI components** for the Scale Dashboard.
They were generated as plain files to be dropped into a React project (Next.js, Vite, or similar).

## Structure

```
src/
├── components/
│   ├── Charts.tsx       # Recharts wrappers (Revenue & Investment)
│   ├── MetricCard.tsx   # KPI display card
│   ├── OrdersTable.tsx  # Sales data table
│   ├── Sidebar.tsx      # Navigation & Layout
│   └── TopFilters.tsx   # Date & Campaign controls
├── pages/
│   └── DashboardPage.tsx # Main entry point assembling the dashboard
├── mockData.ts          # Realistic sample data
└── types.ts             # TypeScript definitions
```

## Dependencies

To use these components, ensure your project has the following installed:

```bash
npm install lucide-react recharts clsx tailwind-merge
```

## Usage

Import `DashboardPage` to see the full layout:

```tsx
import { DashboardPage } from './src/pages/DashboardPage';

function App() {
  return <DashboardPage />;
}
```
