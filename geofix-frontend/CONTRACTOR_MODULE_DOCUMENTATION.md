# Contractor Module Documentation

## Overview
The contractor module provides a complete solution for contractors to manage their assigned civic infrastructure tickets and worker teams. This is a professional, efficient implementation following Next.js 14 best practices.

## Features Implemented

### 1. **Contractor Dashboard** (`/dashboard/contractor`)
- **Real-time Statistics**: 
  - Total assigned tickets
  - Tickets to assign to workers
  - In-progress tickets
  - Completed tickets
  - Active workers count
- **Quick Actions**: Direct navigation to key sections
- **Recent Tickets Preview**: Shows last 5 tickets with status badges
- **Responsive Design**: Works on all device sizes

### 2. **Tickets Management** (`/dashboard/contractor/tickets`)
- **View All Assigned Tickets**: Complete list of tickets assigned to the contractor
- **Search & Filter**: 
  - Search by title, location, or description
  - Filter by status (To Assign, Assigned to Worker, In Progress, Completed)
- **Assign to Workers**: Easy dialog to assign tickets to available workers
- **Ticket Details**:
  - Citizen information
  - Location and photos
  - Current status
  - Assigned worker (if applicable)
- **Status-based Color Coding**: Visual identification of ticket status
- **Worker Availability Check**: Alert if no workers are available

### 3. **Workers Management** (`/dashboard/contractor/workers`)
- **Add New Workers**: Simple form to create worker accounts
  - Name, email, password, mobile, address
  - Automatic role assignment (ROLE_WORKER)
  - Linked to contractor automatically
- **View All Workers**: Grid view of all workers
  - Contact information
  - Status badges
  - Quick actions
- **Remove Workers**: Delete worker with confirmation
- **Search Workers**: Find workers by name, email, or phone
- **Statistics**:
  - Total workers
  - Active workers
  - Available workers

### 4. **Performance Overview** (`/dashboard/contractor/performance`)
- **Key Metrics Dashboard**:
  - Total tickets handled
  - Completion statistics
  - Active work tracking
  - Team size
- **Visual Progress Indicators**:
  - Completion rate with progress bars
  - Active work percentage
  - Performance trends
- **Team Analytics**:
  - Average tickets per worker
  - Active vs total workers
  - Work distribution insights
- **Performance Summary**: Quick overview of current status

## Backend Integration

### API Endpoints Used
All endpoints are from `/api/contractor`:

1. **Worker Management**
   - `POST /api/contractor/workers` - Create worker
   - `GET /api/contractor/workers` - Get all workers
   - `PUT /api/contractor/workers/{id}` - Update worker
   - `DELETE /api/contractor/workers/{id}` - Remove worker

2. **Ticket Management**
   - `GET /api/contractor/tickets` - Get assigned tickets
   - `PUT /api/contractor/tickets/{id}/assign` - Assign ticket to worker

### Service Layer
**File**: `src/services/contractorService.ts`
- Complete TypeScript service with type safety
- Error handling and user-friendly messages
- Helper methods for status labels and colors
- Consistent API response handling

## File Structure

```
geofix-frontend/src/
├── app/[locale]/dashboard/contractor/
│   ├── page.tsx                    # Main dashboard
│   ├── tickets/
│   │   └── page.tsx                # Tickets management
│   ├── workers/
│   │   └── page.tsx                # Workers management
│   └── performance/
│       └── page.tsx                # Performance analytics
├── services/
│   └── contractorService.ts        # API service
├── components/
│   ├── ui/
│   │   └── dialog.tsx              # Dialog component (created)
│   └── CollapsibleSidebar.tsx      # Updated with contractor menu
└── types/
    └── index.ts                     # TypeScript types
```

## UI Components Used

### Existing Components
- `DashboardHeader` - Consistent header across pages
- `CollapsibleSidebar` - Updated with contractor-specific menu
- `DashboardFooter` - Footer component
- All shadcn/ui components (Card, Button, Badge, Input, etc.)

### New Components Created
- `Dialog` - Modal dialogs for forms and confirmations
- Used existing `Label`, `Select`, `Progress` components

## Design Principles

### 1. **No Clutter**
- Reused existing components wherever possible
- Logical file organization under `/contractor` folder
- Clean, focused pages with single responsibilities

### 2. **Professional UI**
- Consistent with citizen and admin pages
- Professional color scheme (orange primary, status-based colors)
- Clear visual hierarchy
- Proper spacing and typography

### 3. **Efficient Implementation**
- Next.js 14 App Router patterns
- Client-side rendering where needed
- Optimistic updates and loading states
- Error handling at every level

### 4. **Type Safety**
- Full TypeScript implementation
- Proper interfaces for all data structures
- Type-safe API calls

### 5. **User Experience**
- Loading states for async operations
- Error messages for failed operations
- Empty states with helpful messages
- Confirmation dialogs for destructive actions
- Search and filter capabilities

## Navigation Flow

```
Contractor Dashboard
├── View Assigned Tickets → Tickets Page → Assign to Worker
├── Manage Workers → Workers Page → Add/Remove Workers
└── Performance Overview → Performance Page → View Analytics
```

## Usage

### For Contractors:
1. **Login** as contractor
2. **Dashboard** shows overview of work
3. **Tickets Page**: View and assign tickets to workers
4. **Workers Page**: Manage team members
5. **Performance Page**: Track work statistics

### For Development:
1. All pages use the same authentication flow
2. Protected routes check for `ROLE_CONTRACTOR`
3. API calls use the centralized `contractorService`
4. Error handling is consistent across all pages

## Next Steps (Optional Enhancements)

1. **Ticket Detail Page**: Individual ticket view with full history
2. **Worker Profile**: Detailed worker performance tracking
3. **Notifications**: Real-time updates for ticket changes
4. **Reports**: Download performance reports
5. **Calendar View**: Schedule-based ticket view
6. **Mobile App**: Progressive Web App features

## Testing Checklist

- [ ] Login as contractor
- [ ] View dashboard with real data
- [ ] Add a new worker
- [ ] View all workers
- [ ] Search for workers
- [ ] Remove a worker
- [ ] View assigned tickets
- [ ] Filter tickets by status
- [ ] Assign ticket to worker
- [ ] View performance metrics
- [ ] Check responsive design on mobile
- [ ] Verify error handling

## Notes

- All pages follow the same authentication pattern as citizen pages
- Service layer provides consistent error messages
- UI maintains design consistency with the rest of the application
- No backend files were modified (as requested)
- Minimal new files created - only what was necessary
- Leveraged Next.js 14 features (App Router, Server/Client Components)
