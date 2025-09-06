### MN Tyres Lite

This web-based tyre stock management system is designed for garages to help them keep track of sales, stock and revenue and provide real time data to support decision making.

### Features

### Stock Management
- **Add Tyres**: Add new tyre stock with size, brand, quantity, and net price
- **Duplicate Detection**: Automatically detects existing tyre size + brand combinations
- **Weighted Average Pricing**: When adding duplicate tyres, calculates weighted average net price
- **Live Search**: Real-time search functionality to filter tyres by size
- **Smart Sorting**: Tyres sorted by size (width/aspect ratio/diameter) in ascending order
- **Inline Editing**: Click to edit quantity and net price with confirmation prompts
- **Brand Management**: Add custom brands with modal interface

### Sales Management
- **Create Sales**: Record tyre sales with customer details
- **Payment Methods**: Track Cash and Card payments
- **Sales Person Tracking**: Assign sales to specific staff members
- **Invoice Generation**: Professional PDF invoices with company branding
- **Sales Records**: Complete sales history with filtering and search
- **Status Management**: Track completed and cancelled sales

### Reporting & Analytics
- **Profit Calculation**: Formula: `(Fitting Price - Net Price × 1.2) × Quantity`
- **Time-based Reports**: Filter by Today, Yesterday, This Week, Last Month, Custom Date Range
- **Sales Count**: Track number of sales per period
- **Real-time Updates**: Reports update automatically when sales are cancelled

### Calendar Management
- **Appointment Creation**: Add, alter and delete new appointments on the calendar,
- **Calendar**: Show calendar on left with user able to navigate through it
- **Reminders & Notifications**: Get alerts before appointments start
- **Booking Pages**: Reschedule to Sales Management '(refer to. ### Sales Management)'

### User Interface
- **Modern Design**: Dark theme with professional styling
- **Responsive Layout**: Works on desktop and mobile devices
- **Modal Dialogs**: Clean interfaces for adding brands and sales people
- **Toast Notifications**: User feedback for actions
- **Search & Filter**: Comprehensive filtering across all data

## Technical Architecture

### Current Implementation
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Storage**: Browser Local Storage
- **Styling**: Custom CSS with CSS Variables
- **PDF Generation**: Browser-based PDF creation
- **No Backend**: Single-user application

### File Structure
```
Tyre_App/
├── index.html          # Main application interface
├── app.js             # Core application logic (1,917 lines)
├── styles.css         # Application styling (742 lines)
└── README.md          # This documentation
```

## Data Models

### Stock Item
```javascript
{
  id: "unique_id",
  size: "195/65/15",
  brand: "Michelin",
  quantity: 10,
  net: 25.50,
  suggestedFittingPrice: 35.00,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Sale Record
```javascript
{
  id: "unique_id",
  size: "195/65/15",
  brand: "Michelin",
  quantity: 2,
  fittingPrice: 35.00,
  total: 70.00,
  customerName: "John Smith",
  customerPhone: "01234567890",
  paymentMethod: "Card",
  salesPerson: "Mike Johnson",
  status: "completed",
  date: "2024-01-01T00:00:00.000Z"
}
```

### Brand
```javascript
{
  id: "unique_id",
  name: "Michelin",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Sales Person
```javascript
{
  id: "unique_id",
  name: "Mike Johnson",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## Business Logic

### Tyre Size Validation
- Format: `XXX/XX/XX` or `XXX/XX/XXC` (for commercial tyres) or `XXX/XX/XXRFT` (for runflat tyres) or `XXX/XX/XXLT` (for light truck tyres)
- Examples: `195/65/15`, `235/65/16C`, `225/45/17RFT`, `155/70/12LT`
- Validates: 3 digits / 2 digits / 2-3 characters

### Weighted Average Calculation
When adding duplicate tyres:
```
Weighted Average = (Existing Qty × Existing Price + New Qty × New Price) ÷ Total Qty
```

### Profit Calculation
```
Profit = (Fitting Price - Net Price × 1.2) × Quantity
```

## 🌐 Online Hosting & Monetization Strategy

### Proposed Architecture for Online Version

#### Backend Options
1. **Supabase** (Recommended)
   - PostgreSQL database
   - Built-in authentication
   - Real-time subscriptions
   - Row Level Security (RLS)

2. **Firebase**
   - Firestore database
   - Firebase Auth
   - Cloud Functions
   - Hosting

3. **Custom Backend**
   - Node.js/Express or Python/Django
   - PostgreSQL/MySQL database
   - JWT authentication

#### Required Features for Online Version
- **User Authentication**: Registration, login, password reset
- **Multi-tenant Architecture**: Data isolation per user
- **Subscription Management**: Monthly billing with Stripe
- **Data Migration**: Import/export functionality
- **Backup & Security**: Automated backups, SSL certificates

### Pricing Strategy

#### Recommended Pricing Tiers
- **Starter**: £25/month
  - Up to 500 stock items
  - Basic reporting
  - Email support
  - 1 user account

- **Professional**: £45/month
  - Unlimited stock
  - Advanced reporting & analytics
  - Priority support
  - Up to 5 user accounts
  - API access

- **Enterprise**: £85/month
  - All Professional features
  - Unlimited users
  - Custom features
  - Dedicated support
  - White-label options

#### Revenue Projections
- **Year 1 Target**: 100+ paying customers
- **Monthly Revenue**: £2,500-8,500
- **Annual Revenue**: £30,000-102,000

### Implementation Roadmap

#### Phase 1: Infrastructure Setup (2-3 weeks)
1. Purchase domain name
2. Set up Supabase project
3. Design database schema
4. Implement authentication system

#### Phase 2: Data Migration (1-2 weeks)
1. Convert local storage functions to API calls
2. Create data import/export tools
3. Implement user onboarding flow
4. Set up subscription management

#### Phase 3: Launch & Marketing (Ongoing)
1. Deploy to production
2. Set up analytics and monitoring
3. Create marketing materials
4. Launch beta program with local garages

## 🛠️ Development Setup

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. Start adding stock and creating sales

### Online Development
1. Set up Supabase account
2. Create new project
3. Configure authentication
4. Set up database tables
5. Deploy frontend to Vercel/Netlify

## Future Enhancements

### Short-term (3-6 months)
- Multi-user support
- Mobile app (PWA)
- Advanced reporting dashboard
- Customer management system
- Supplier management

### Long-term (6-12 months)
- Integration with accounting software
- Barcode scanning
- Automated reorder points
- Multi-location support
- Advanced analytics and insights

## Key Features Highlights

### Smart Inventory Management
- Automatic duplicate detection
- Weighted average pricing
- Real-time stock updates
- Professional sorting algorithm

### Comprehensive Sales Tracking
- Complete customer information
- Payment method tracking
- Sales person attribution
- Professional invoice generation

### Advanced Reporting
- Real-time profit calculations
- Flexible date filtering
- Sales performance metrics
- Export capabilities

### User Experience
- Intuitive interface design
- Responsive layout
- Real-time feedback
- Professional styling

## Technical Specifications

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- Local storage: ~10MB limit
- Real-time updates
- Optimized rendering
- Minimal dependencies

### Security (Current)
- Client-side validation
- Local data storage
- No external dependencies

### Security (Online Version)
- HTTPS encryption
- User authentication
- Data encryption at rest
- Regular security audits

## Support & Contact

For technical support or business inquiries, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**License**: MNTyres
