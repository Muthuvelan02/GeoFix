# 📋 FRONTEND PAGES CREATION GUIDE

## GeoFix - Civic Infrastructure Management System

This document provides detailed prompts for creating all required frontend pages. Each prompt is designed for easy backend integration later.

---

## 🎨 **DESIGN SYSTEM REFERENCE**

### Color Palette (Consistent across all pages):

- **Primary Orange**: `bg-orange-600`, `hover:bg-orange-700`, `text-orange-600`
- **Status Colors**:
  - Pending: `bg-yellow-100 text-yellow-800`
  - In Progress: `bg-blue-100 text-blue-800`
  - Completed: `bg-green-100 text-green-800`
  - Rejected: `bg-red-100 text-red-800`
  - Active: `bg-green-100 text-green-800`

### Existing Components to Use:

- `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/components/ui/card`
- `Button` from `@/components/ui/button`
- `Badge` from `@/components/ui/badge`
- `Input` from `@/components/ui/input`
- `Dialog` components from `@/components/ui/dialog`
- `Select` components from `@/components/ui/select`
- `Progress` from `@/components/ui/progress`
- `DashboardHeader`, `CollapsibleSidebar`, `DashboardFooter`

### Layout Pattern (Use in ALL pages):

```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <DashboardHeader />
  <div className="flex">
    <CollapsibleSidebar userRole="[ROLE]" locale={locale} user={user} />
    <main className="flex-1 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page content here */}
      </div>
      <DashboardFooter />
    </main>
  </div>
</div>
```

---

## 📑 **PAGES TO CREATE - ORGANIZED BY ROLE**

---

# 🔴 **ADMIN ROLE PAGES** (Priority: HIGH)

## Page 1: Admin - Contractor Management

**File Path**: `src/app/[locale]/dashboard/admin/contractors/page.tsx`

### Purpose:

View pending contractors and verify/reject them. List all contractors with their status.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Contractor Management"         │
├─────────────────────────────────────────┤
│ Stats Cards (3 columns):                │
│ [Total Contractors] [Pending] [Active]  │
├─────────────────────────────────────────┤
│ Tabs:                                   │
│ ▶ Pending Verification | All Contractors│
├─────────────────────────────────────────┤
│ Search Box + Filter by Status           │
├─────────────────────────────────────────┤
│ Contractor Cards Grid (3 columns):      │
│ ┌──────────────────────────┐            │
│ │ 👷 Contractor Name        │            │
│ │ 📧 Email | 📱 Phone       │            │
│ │ 📍 Address                │            │
│ │ 📊 Status Badge           │            │
│ │ [✓ Verify] [✗ Reject]    │            │
│ └──────────────────────────┘            │
└─────────────────────────────────────────┘
```

### Mock Data Structure:

```typescript
interface Contractor {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  createdAt: string;
}

// Use this mock data:
const mockContractors: Contractor[] = [
  {
    id: 1,
    name: "ABC Construction",
    email: "abc@example.com",
    mobile: "9876543210",
    address: "123 Builder St",
    status: "PENDING",
    createdAt: "2025-10-01",
  },
  {
    id: 2,
    name: "XYZ Contractors",
    email: "xyz@example.com",
    mobile: "9876543211",
    address: "456 Work Ave",
    status: "ACTIVE",
    createdAt: "2025-09-15",
  },
  {
    id: 3,
    name: "BuildIt Corp",
    email: "buildit@example.com",
    mobile: "9876543212",
    address: "789 Construct Rd",
    status: "PENDING",
    createdAt: "2025-10-03",
  },
];
```

### Key Features:

- Tab navigation (Pending vs All)
- Search by name/email
- Filter dropdown for status
- Verify/Reject buttons with confirmation dialog
- Status badges with colors
- Empty state message

### Backend Integration Points (for later):

```typescript
// TO BE REPLACED WITH:
// const contractors = await adminService.getPendingContractors()
// const contractors = await adminService.getAllContractors()
// await adminService.verifyContractor(id, 'VERIFIED')
// await adminService.verifyContractor(id, 'REJECTED')
```

---

## Page 2: Admin - Ticket/Issue Assignment

**File Path**: `src/app/[locale]/dashboard/admin/issues/page.tsx`

### Purpose:

View all pending tickets from citizens and assign them to verified contractors.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Issue Management"              │
├─────────────────────────────────────────┤
│ Stats Cards (5 columns):                │
│ [Total] [Pending] [Assigned] [Progress] │
│ [Completed]                             │
├─────────────────────────────────────────┤
│ Filters Row:                            │
│ [Search] [Status Filter] [Date Filter]  │
├─────────────────────────────────────────┤
│ Ticket List (Stacked Cards):            │
│ ┌──────────────────────────────────────┐│
│ │ 🎫 #123 | Road Damage - MG Road     ││
│ │ 📝 Description preview...            ││
│ │ 👤 Citizen: John Doe                ││
│ │ 📍 Location | 📅 Created: Oct 1     ││
│ │ 📊 Status Badge                     ││
│ │ 📷 [Photo thumbnails if any]        ││
│ │ [👁 View] [➡ Assign to Contractor]  ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Mock Data Structure:

```typescript
interface AdminTicket {
  id: number;
  title: string;
  description: string;
  location: string;
  status:
    | "PENDING"
    | "ASSIGNED_TO_CONTRACTOR"
    | "ASSIGNED_TO_WORKER"
    | "IN_PROGRESS"
    | "COMPLETED";
  citizen: { id: number; name: string; email: string; mobile: string };
  assignedContractor?: { id: number; name: string };
  photos?: string[];
  createdAt: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

// Mock data:
const mockTickets: AdminTicket[] = [
  {
    id: 1,
    title: "Pothole on MG Road",
    description: "Large pothole causing traffic issues",
    location: "MG Road, Near Central Mall",
    status: "PENDING",
    citizen: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "9876543210",
    },
    createdAt: "2025-10-01T10:30:00",
    priority: "HIGH",
    photos: ["photo1.jpg", "photo2.jpg"],
  },
  {
    id: 2,
    title: "Street Light Not Working",
    description: "Street light broken for 3 days",
    location: "Park Street, Sector 5",
    status: "ASSIGNED_TO_CONTRACTOR",
    citizen: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      mobile: "9876543211",
    },
    assignedContractor: { id: 1, name: "ABC Construction" },
    createdAt: "2025-09-28T14:20:00",
    priority: "MEDIUM",
  },
];
```

### Key Features:

- Search by title/location
- Filter by status and date
- Priority badges (HIGH=red, MEDIUM=orange, LOW=blue)
- Photo gallery thumbnails
- Assign dialog with contractor dropdown
- View detail button
- Status-based color coding on left border

### Backend Integration Points:

```typescript
// TO BE REPLACED:
// const tickets = await adminService.getAllTickets()
// const contractors = await adminService.getActiveContractors()
// await adminService.assignTicketToContractor(ticketId, contractorId)
```

---

## Page 3: Admin - Analytics Dashboard

**File Path**: `src/app/[locale]/dashboard/admin/analytics/page.tsx`

### Purpose:

Display comprehensive analytics with charts and metrics.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Analytics & Reports"           │
├─────────────────────────────────────────┤
│ Key Metrics (4 columns):                │
│ [Total Issues] [Avg Resolution Time]    │
│ [Active Contractors] [Completion Rate]  │
├─────────────────────────────────────────┤
│ Charts Row (2 columns):                 │
│ ┌──────────────┐ ┌──────────────┐       │
│ │ Ticket Stats │ │ Status Dist. │       │
│ │ Progress Bar │ │ Pie Visual   │       │
│ └──────────────┘ └──────────────┘       │
├─────────────────────────────────────────┤
│ Performance Table:                      │
│ Top Contractors by completion rate      │
├─────────────────────────────────────────┤
│ Recent Activity Timeline                │
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockAnalytics = {
  totalIssues: 156,
  avgResolutionDays: 3.5,
  activeContractors: 12,
  completionRate: 78.5,
  ticketsByStatus: {
    pending: 23,
    assigned: 45,
    inProgress: 34,
    completed: 54,
  },
  topContractors: [
    { name: "ABC Construction", completed: 23, rate: 95.8 },
    { name: "XYZ Contractors", completed: 18, rate: 90.0 },
  ],
};
```

### Key Features:

- Big number cards with icons
- Progress bars for completion rates
- Simple visual representations (can use divs styled as bars)
- Table of top performers
- Date range selector

---

## Page 4: Admin - User Management

**File Path**: `src/app/[locale]/dashboard/admin/users/page.tsx`

### Purpose:

View all citizens and their activity.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "User Management"               │
├─────────────────────────────────────────┤
│ Stats: [Total Users] [Active] [New]     │
├─────────────────────────────────────────┤
│ Search + Filter                         │
├─────────────────────────────────────────┤
│ User Table/Cards:                       │
│ Name | Email | Tickets Raised | Status  │
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    ticketsRaised: 5,
    status: "ACTIVE",
    joinedDate: "2025-09-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    ticketsRaised: 3,
    status: "ACTIVE",
    joinedDate: "2025-09-15",
  },
];
```

---

## Page 5: Admin - Reports Generation

**File Path**: `src/app/[locale]/dashboard/admin/reports/page.tsx`

### Purpose:

Generate and download reports for different time periods.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Reports & Export"              │
├─────────────────────────────────────────┤
│ Date Range Selector:                    │
│ [Start Date] [End Date] [Generate]      │
├─────────────────────────────────────────┤
│ Report Preview Card:                    │
│ Summary statistics for selected period  │
├─────────────────────────────────────────┤
│ Quick Report Templates:                 │
│ [Last Week] [Last Month] [Last Quarter] │
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockReport = {
  period: "2025-09-01 to 2025-10-01",
  totalTickets: 45,
  resolved: 38,
  pending: 7,
  avgResolutionTime: "3.2 days",
};
```

---

# 🟢 **WORKER ROLE PAGES** (Priority: HIGH)

## Page 6: Worker - My Tasks

**File Path**: `src/app/[locale]/dashboard/worker/tasks/page.tsx`

### Purpose:

View all tasks assigned by contractor and update status.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "My Assigned Tasks"             │
├─────────────────────────────────────────┤
│ Stats: [Total] [To Do] [In Progress]    │
│        [Completed]                      │
├─────────────────────────────────────────┤
│ Filter: [All | To Do | In Progress]     │
├─────────────────────────────────────────┤
│ Task Cards:                             │
│ ┌──────────────────────────────────────┐│
│ │ 🎫 Task #123 - Pothole Repair       ││
│ │ 📍 Location                         ││
│ │ 📝 Description                      ││
│ │ 👤 Assigned by: ABC Construction    ││
│ │ 📅 Assigned: Oct 1                  ││
│ │ 📊 Status: To Do                    ││
│ │ [▶ Start Work] [✓ Mark Complete]   ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
interface WorkerTask {
  id: number;
  title: string;
  description: string;
  location: string;
  status: "ASSIGNED_TO_WORKER" | "IN_PROGRESS" | "COMPLETED";
  assignedBy: { id: number; name: string };
  assignedAt: string;
  photos?: string[];
  proofOfWork?: string;
}

const mockTasks: WorkerTask[] = [
  {
    id: 1,
    title: "Pothole Repair on MG Road",
    description: "Fill large pothole near Central Mall",
    location: "MG Road, Near Central Mall",
    status: "ASSIGNED_TO_WORKER",
    assignedBy: { id: 1, name: "ABC Construction" },
    assignedAt: "2025-10-01T10:00:00",
    photos: ["photo1.jpg"],
  },
  {
    id: 2,
    title: "Street Light Repair",
    description: "Replace broken street light",
    location: "Park Street, Sector 5",
    status: "IN_PROGRESS",
    assignedBy: { id: 1, name: "ABC Construction" },
    assignedAt: "2025-09-30T14:00:00",
  },
];
```

### Key Features:

- Filter by status tabs
- Start work button (changes status to IN_PROGRESS)
- Complete work button (opens dialog with photo upload)
- Status badges
- Photo gallery

### Backend Integration Points:

```typescript
// TO BE REPLACED:
// const tasks = await workerService.getMyTasks()
// await workerService.startTask(taskId)
// await workerService.completeTask(taskId, proofPhoto)
```

---

## Page 7: Worker - Complete Task Dialog

**Component**: Part of tasks page above

### UI Structure:

```
Dialog: "Mark Task as Complete"
┌─────────────────────────────────────────┐
│ Task: [Task Title]                      │
│                                         │
│ Upload Proof of Work Photo:             │
│ ┌──────────────────────┐                │
│ │ [📷 Click to Upload] │                │
│ └──────────────────────┘                │
│                                         │
│ Additional Notes (optional):            │
│ [Text Area]                             │
│                                         │
│ [Cancel] [✓ Submit Completion]          │
└─────────────────────────────────────────┘
```

### Key Features:

- Photo upload with preview
- Optional notes textarea
- Submit validation (photo required)

---

# 🔵 **SUPERADMIN ROLE PAGES** (Priority: MEDIUM)

## Page 8: Superadmin - Admin Verification

**File Path**: `src/app/[locale]/dashboard/superadmin/admins/page.tsx`

### Purpose:

Verify new admin registrations.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Admin Management"              │
├─────────────────────────────────────────┤
│ Stats: [Total Admins] [Pending] [Active]│
├─────────────────────────────────────────┤
│ Tabs: Pending | All Admins              │
├─────────────────────────────────────────┤
│ Admin Cards:                            │
│ ┌──────────────────────────────────────┐│
│ │ 👤 Admin Name                        ││
│ │ 📧 Email | 📱 Phone                  ││
│ │ 📅 Registered: Oct 1, 2025          ││
│ │ 📊 Status Badge                     ││
│ │ [✓ Approve] [✗ Reject]              ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockAdmins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    mobile: "9876543210",
    status: "PENDING",
    registeredAt: "2025-10-01",
  },
  {
    id: 2,
    name: "City Admin",
    email: "cityadmin@example.com",
    mobile: "9876543211",
    status: "ACTIVE",
    registeredAt: "2025-09-15",
  },
];
```

---

## Page 9: Superadmin - System Analytics

**File Path**: `src/app/[locale]/dashboard/superadmin/analytics/page.tsx`

### Purpose:

Platform-wide analytics and metrics.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Platform Analytics"            │
├─────────────────────────────────────────┤
│ Overall Stats (4 columns):              │
│ [Total Users] [Total Tickets]           │
│ [Active Admins] [Active Contractors]    │
├─────────────────────────────────────────┤
│ Charts: Platform usage over time        │
├─────────────────────────────────────────┤
│ Performance by City/Region              │
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockPlatformStats = {
  totalUsers: 1250,
  totalTickets: 856,
  activeAdmins: 15,
  activeContractors: 45,
  totalWorkers: 123,
};
```

---

# 🟡 **CITIZEN ROLE PAGES** (Updates Needed)

## Page 10: Citizen - Track Issues (Enhanced)

**File Path**: `src/app/[locale]/dashboard/citizen/track/page.tsx`

### Purpose:

Track all reported issues with real-time status updates.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Track My Issues"               │
├─────────────────────────────────────────┤
│ Filter: [All | Pending | In Progress |  │
│         Completed]                      │
├─────────────────────────────────────────┤
│ Ticket Cards with Timeline:             │
│ ┌──────────────────────────────────────┐│
│ │ 🎫 #123 - Pothole on MG Road        ││
│ │ 📍 Location                         ││
│ │ 📊 Current Status: In Progress      ││
│ │                                     ││
│ │ Timeline:                           ││
│ │ ✓ Reported - Oct 1, 10:30 AM       ││
│ │ ✓ Assigned to Contractor - Oct 1   ││
│ │ ✓ Worker Assigned - Oct 2          ││
│ │ ⏳ In Progress - Oct 3              ││
│ │ ⭕ Completion - Pending             ││
│ │                                     ││
│ │ Assigned To:                        ││
│ │ Contractor: ABC Construction        ││
│ │ Worker: John Worker                 ││
│ │                                     ││
│ │ [View Details] [Contact Support]    ││
│ └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockTracking = [
  {
    id: 1,
    title: "Pothole on MG Road",
    location: "MG Road",
    status: "IN_PROGRESS",
    timeline: [
      { event: "Reported", date: "2025-10-01T10:30:00", completed: true },
      {
        event: "Assigned to Contractor",
        date: "2025-10-01T15:00:00",
        completed: true,
      },
      {
        event: "Worker Assigned",
        date: "2025-10-02T09:00:00",
        completed: true,
      },
      {
        event: "Work In Progress",
        date: "2025-10-03T08:00:00",
        completed: true,
      },
      { event: "Completion", date: null, completed: false },
    ],
    assignedContractor: "ABC Construction",
    assignedWorker: "John Worker",
  },
];
```

### Key Features:

- Visual timeline with checkmarks
- Real-time status updates
- Contact information for assigned parties
- Photo gallery of progress

---

## Page 11: Citizen - Ticket Detail View

**File Path**: `src/app/[locale]/dashboard/citizen/tickets/[id]/page.tsx`

### Purpose:

Detailed view of single ticket with full history.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ ← Back to My Reports                    │
├─────────────────────────────────────────┤
│ Ticket #123 - Pothole on MG Road        │
│ Status: [Badge]                         │
├─────────────────────────────────────────┤
│ Details Section:                        │
│ Description | Location | Priority       │
├─────────────────────────────────────────┤
│ Photos Gallery                          │
├─────────────────────────────────────────┤
│ Timeline                                │
├─────────────────────────────────────────┤
│ Assignment Info                         │
├─────────────────────────────────────────┤
│ Proof of Work (if completed)            │
└─────────────────────────────────────────┘
```

---

## Page 12: Citizen - Help/FAQ

**File Path**: `src/app/[locale]/dashboard/citizen/help/page.tsx`

### Purpose:

Help documentation and FAQs.

### UI Structure:

```
┌─────────────────────────────────────────┐
│ Header: "Help & Support"                │
├─────────────────────────────────────────┤
│ Search FAQs                             │
├─────────────────────────────────────────┤
│ FAQ Accordion:                          │
│ ▼ How do I report an issue?            │
│   [Answer content]                      │
│ ▶ How long does it take to resolve?    │
│ ▶ Can I track my issue?                │
├─────────────────────────────────────────┤
│ Contact Support Card:                   │
│ Email | Phone | Hours                   │
└─────────────────────────────────────────┘
```

### Mock Data:

```typescript
const mockFAQs = [
  {
    q: "How do I report an issue?",
    a: "Click on 'Report Issue' in the menu and fill out the form with details and photos.",
  },
  {
    q: "How long does it take?",
    a: "Most issues are resolved within 3-5 business days.",
  },
  {
    q: "Can I track my issue?",
    a: "Yes! Go to 'Track Issues' to see real-time updates.",
  },
];
```

---

# 📝 **SUMMARY OF ALL PAGES**

## Total Pages to Create: 12

### Admin (5 pages):

1. ✅ Contractor Management - `/admin/contractors`
2. ✅ Issue Assignment - `/admin/issues`
3. ✅ Analytics - `/admin/analytics`
4. ✅ User Management - `/admin/users`
5. ✅ Reports - `/admin/reports`

### Worker (2 pages):

6. ✅ My Tasks - `/worker/tasks`
7. ✅ (Task completion is part of #6)

### Superadmin (2 pages):

8. ✅ Admin Verification - `/superadmin/admins`
9. ✅ Platform Analytics - `/superadmin/analytics`

### Citizen (3 pages):

10. ✅ Track Issues - `/citizen/track`
11. ✅ Ticket Detail - `/citizen/tickets/[id]`
12. ✅ Help/FAQ - `/citizen/help`

---

## 🎯 **INSTRUCTIONS FOR CREATION**

### For Each Page:

1. **File Structure**:

   ```
   "use client"

   import React, { useState, useEffect } from "react"
   import { useRouter } from "@/i18n/navigation"
   import { useParams } from "next/navigation"
   // ... other imports

   export default function PageName() {
       // State with mock data
       // Layout with sidebar
       // Return JSX
   }
   ```

2. **Use Mock Data**: Place mock data at the top as constants

3. **Loading States**: Include simple loading spinner

4. **Empty States**: Show helpful messages when no data

5. **Responsive**: Grid layouts that stack on mobile

6. **Consistent Styling**: Use the design system colors

---

## 🔄 **BACKEND INTEGRATION MARKERS**

In each page, add comments like:

```typescript
// BACKEND INTEGRATION POINT
// TO BE REPLACED WITH: await adminService.getPendingContractors()
const contractors = mockContractors; // MOCK DATA
```

This makes it easy to find and replace later!

---

## ✅ **NEXT STEPS**

1. I'll create these pages one by one
2. Each page will have mock data
3. All pages will look professional
4. After all pages are done, we'll integrate backend
5. Test the complete workflow

**Ready to start? Reply with:**

- "Start with Admin pages" (Recommended - most critical)
- "Start with Worker pages"
- "Start with Citizen pages"
- "Start with Superadmin pages"

Or tell me a specific order you prefer! 🚀
