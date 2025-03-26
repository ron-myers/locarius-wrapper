const { createEvent } = require('./create-event');

createEvent({
  headless: false,
  eventName: 'Example Event Name',
  description: 'A brief description of your event goes here. This can be multiple sentences describing what attendees can expect.',
  // note this script does not support dates in the past (the app will let you create them, but they will not show up where we are looking in the app )
  startDate: '01/01/2024 09:00 AM',
  endDate: '01/01/2024 05:00 PM',
  imageUrl: "https://locarius.io/assets/images/whitelabel/locarius/logo.png",
  locationName: 'Venue Name',
  address1: '123 Main Street',
  city: 'City Name',
  state: 'ST',
  ticketName: 'General Admission',
  ticketQuantity: 100
});
