# Lendsqr Frontend Engineering Test

This is a frontend application built for Lendsqr's engineering assessment. The application displays users, their details, and provides various filtering and viewing capabilities.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **SCSS** - CSS preprocessing
- **React Router DOM** - Client-side routing
- **Vitest** - Unit testing framework
- **Vite** - Build tool and dev server

## 📋 Features

### ✅ Implemented Pages

1. **Login Page** - User authentication with form validation
2. **Dashboard** - Overview with statistics cards
3. **Users List Page** - Displays 500 mock users with:
   - Advanced filtering (organization, username, email, phone, status)
   - Pagination (customizable items per page)
   - Status badges
   - Action menu (view details, blacklist, activate)
   - Fully responsive design
4. **User Details Page** - Comprehensive user information with:
   - Personal information
   - Education and employment details
   - Social media links
   - Guarantor information
   - Tab navigation

### 🎯 Key Features

- ✅ 500 mock user records generated programmatically
- ✅ Local storage for data persistence
- ✅ Protected routes with authentication
- ✅ Fully responsive mobile design
- ✅ Pixel-perfect implementation following best practices
- ✅ Clean, maintainable code structure
- ✅ TypeScript for type safety
- ✅ SCSS with variables and mixins

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 📁 Project Structure

```
lendsqr-fe-test/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # Global styles, variables, mixins
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (mock data, storage)
│   └── tests/           # Test files
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔐 Authentication

Login with any email and password (minimum 6 characters).

## 📊 Features

### Users List

- 500 mock users
- Filter by: organization, username, email, phone number, status
- Customizable pagination (10, 20, 50, 100 items per page)
- Status badges and action menus

### User Details

- Comprehensive user information
- Tab navigation
- Action buttons (Blacklist/Activate)
- Data stored in localStorage

## 🌐 Deployment

Deployed at: `https://[candidate-name]-lendsqr-fe-test.[platform].com`

---

**Built for Lendsqr Engineering Assessment**
