# Real-Time Ticket Notifications

## Overview

The admin dashboard now includes a real-time notification system that automatically detects and displays new tickets as they are created. This ensures admins are immediately aware of new issues that need attention.

## Features

### 1. Manual Refresh System

- **Polling**: Disabled by default to save resources
- **Manual Updates**: Users click refresh button to fetch latest ticket data
- **Visual Indicators**: Shows status with colored dots (blue = manual mode, yellow = updating)

### 2. New Ticket Notifications

- **Alert Banner**: Blue notification banner appears when new tickets are detected
- **Count Display**: Shows exact number of new tickets since last refresh
- **Quick Actions**:
  - "View Tickets" button to navigate to tickets page
  - "Mark as Read" button to clear the notification

### 3. Enhanced UI Elements

- **Header Notifications**: Notification count in dashboard header includes new tickets
- **Recent Tickets Section**: Shows latest 5 tickets sorted by creation date
- **NEW Badges**: Green "NEW" badges on tickets created within the last 5 minutes
- **Status Indicators**: Real-time status showing "Live" or "Updating..."

### 4. Manual Refresh

- **Refresh Button**: Primary way to update data on both dashboard and tickets page
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Graceful error handling with fallback to empty states
- **Resource Efficient**: No automatic polling to save server resources

## Technical Implementation

### Custom Hook: `useRealTimeData`

```typescript
const { data, loading, error, refresh, clearNewTicketsCount } = useRealTimeData(
  {
    pollingInterval: 5000, // 5 seconds
    enabled: true,
  }
);
```

### Data Structure

```typescript
interface RealTimeData {
  tickets: TicketForAdmin[];
  newTicketsCount: number;
  lastUpdate: Date;
}
```

### Key Methods

- `refresh()`: Manually trigger data refresh
- `clearNewTicketsCount()`: Clear new ticket notifications
- Automatic polling with configurable interval

## Usage

### Admin Dashboard (`/en/dashboard/admin`)

1. **Real-time Status**: Shows live monitoring status at the top
2. **New Ticket Alerts**: Blue banner appears when new tickets are created
3. **Recent Tickets**: Displays latest 5 tickets with status badges
4. **Notification Count**: Header shows total pending + new tickets

### Tickets Page (`/en/dashboard/admin/tickets`)

1. **Live Indicator**: Green/yellow dot shows real-time status
2. **NEW Badges**: Recent tickets (within 5 minutes) show "NEW" badge
3. **Manual Refresh**: Refresh button for immediate updates
4. **Real-time Updates**: Ticket list updates automatically

## Configuration

### Refresh Mode

- **Default**: Manual refresh only (polling disabled)
- **Resource Efficient**: No automatic polling to save server resources
- **User Controlled**: Admins decide when to refresh data

### New Ticket Detection

- Compares ticket creation timestamps with last update time
- Shows "NEW" badge for tickets created within last 5 minutes
- Automatically clears notifications when marked as read

## Benefits

1. **Resource Efficient**: No automatic polling saves server resources
2. **User Controlled**: Admins decide when to refresh data
3. **Visual Feedback**: Clear indicators of system status and new content
4. **Better Performance**: Reduced server load and network requests
5. **Manual Refresh**: Click refresh button when you need updated data

## Future Enhancements

- WebSocket integration for true real-time updates
- Push notifications for critical tickets
- Sound alerts for new high-priority tickets
- Email/SMS notifications for offline admins
- Real-time collaboration features for ticket assignment
