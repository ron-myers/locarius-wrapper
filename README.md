# Locarius The Missing API Wrapper

> Anything that works in the web browser can be an API - RM

## Description

This tool automates the processes on the Locarius platform for items which do not offer an API. It handles everything from login to event creation, including setting up event details, location, tickets, and publishing.

## Prerequisites

- Node.js
- npm
- A Locarius account

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
LOCARIUS_ROOT_URL=https://locarius.io
LOCARIUS_ACCOUNT_EMAIL=your_account_email
LOCARIUS_ACCOUNT_PASSWORD=your_account_password
```

## Usage

1. Update the event details in `index.js` or create a new script using the `createEvent` function:

```javascript
const { createEvent } = require('./create-event');

createEvent({
  headless: false,  // Set to true for headless mode
  eventName: 'Your Event Name',
  description: 'Your event description',
  startDate: 'MM/DD/YYYY HH:MM AM/PM',
  endDate: 'MM/DD/YYYY HH:MM AM/PM',
  imageUrl: "your_image_url",
  locationName: 'Venue Name',
  address1: 'Street Address',
  city: 'City Name',
  state: 'State',
  ticketName: 'Ticket Type',
  ticketQuantity: 100
});
```

2. Run the script:
```bash
npm run create-event
```

## Features

- Automated login process
- Event creation with customizable:
  - Event details (name, description, dates)
  - Image upload via URL
  - Location information
  - Ticket configuration
- Automatic event publishing
- Returns event URL and ID upon completion

## Return Value

The script returns an object containing:
- `url`: The complete URL to the created event
- `id`: The numeric ID of the created event

## Notes

- The script does not support creating events with past dates
- Ensure all required fields are filled correctly, this tool does not have validation.
- The tool includes built-in waits and timeouts for reliable automation, but they can likely be improved.
- The script does not handle when there are multiple pages of events.  That will need to be added shortly.  If you need this right away - create an issue.

## License

MIT
