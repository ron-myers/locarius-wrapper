require('dotenv').config();

const { chromium } = require('playwright');

// todo - support multiple pages of events

const rootUrl = process.env.LOCARIUS_ROOT_URL;
const accessPassword = process.env.LOCARIUS_ACCESS_PASSWORD;
const accountEmail = process.env.LOCARIUS_ACCOUNT_EMAIL;
const accountPassword = process.env.LOCARIUS_ACCOUNT_PASSWORD;

async function createEvent({
  headless,
  eventName,
  description,
  startDate,
  endDate,
  imageUrl,
  locationName,
  address1,
  city,
  state,
  ticketName,
  ticketQuantity
}) {
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Step 1: Navigating to website...');
    await page.goto(rootUrl);

    console.log('Step 2: Handling password wall...');
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
        await page.fill('input[type="password"]', accessPassword);
        await page.click('button[data-testid="auth-provider-login-button"]');
    } else {
        console.log('Password wall not present, skipping...');
    }

    console.log('Step 3: Starting login process...');
    await page.click('button[data-testid="login-button"]');
    await page.waitForTimeout(1000);
    await page.waitForSelector('#loginemail', { timeout: 20000 });
    await page.fill('#loginemail', accountEmail);
    await page.fill('#loginpassword', accountPassword);
    await page.click('#btn-login');
    console.log('Step 3: Login completed');

    console.log('Step 4: Navigating to event creation...');
    await page.waitForTimeout(4000);
    await page.waitForSelector('[data-testid="create-event-button"]', { timeout: 20000 });
    await page.click('[data-testid="create-event-button"]');
    await page.click('[data-testid="add-new-event"]');

    console.log('Step 5: Filling event details...');
    await page.waitForSelector('input[name="name"]', { timeout: 20000 });
    await page.fill('input[name="name"]', eventName);
    // click to make the editor editable
    await page.click('.tiptap');
    await page.fill('[contenteditable="true"]', description);
    
    const startDateLabel = await page.$('text="Start Date"');
    const startDateForAttr = await page.evaluate(element => element.getAttribute('for'), startDateLabel);
    console.log(`Start Date for attribute value: ${startDateForAttr}`);
    await page.fill('input[id="'+startDateForAttr+'"]', startDate);
    
    const endDateLabel = await page.$('text="End Date"');
    const endDateForAttr = await page.evaluate(element => element.getAttribute('for'), endDateLabel);
    console.log(`End Date for attribute value: ${endDateForAttr}`);
    
    await page.fill('input[id="'+endDateForAttr+'"]', endDate);
    console.log('Step 5a: Basic details completed');
    
    console.log('Step 6: Handling image upload...');
    await page.click('button:has-text("Choose an image")');
    await page.waitForSelector('[title="Direct Link"]', { timeout: 20000 });
    await page.click('[title="Direct Link"]');
    await page.waitForSelector('input[placeholder="Paste your link here..."]', { timeout: 20000 });
    await page.fill('input[placeholder="Paste your link here..."]', imageUrl);
    await page.click('.uploadcare--form button[type="submit"]');
    await page.waitForSelector('.uploadcare--preview__done', { timeout: 20000 });
    await page.click('.uploadcare--preview__done');
    console.log('Step 6: Image upload completed');
    

    console.log('Step 7: Moving to location tab...');
    await page.waitForSelector('[data-testid="edit-event-next"]', { timeout: 20000 });
    await page.click('[data-testid="edit-event-next"]');

    console.log('Step 8: Filling location details...');
    await page.waitForSelector('input[name="location.name"]', { timeout: 20000 });
    await page.fill('input[name="location.name"]', locationName);
    await page.fill('input[name="location.address1"]', address1);
    await page.fill('input[name="location.city"]', city);
    await page.fill('input[name="location.state"]', state);
    console.log('Step 8: Location details completed');

    console.log('Step 9: Moving to tickets tab...');
    await page.waitForSelector('[data-testid="edit-event-next"]', { timeout: 20000 });
    await page.click('[data-testid="edit-event-next"]');
    await page.waitForSelector('[data-testid="add-tickets-button"]', { timeout: 20000 });
    await page.click('[data-testid="add-tickets-button"]');

    console.log('Step 10: Setting up ticket information...');
    await page.waitForSelector('input[name="ticketBlocks.name"]', { timeout: 20000 });
    await page.fill('input[name="ticketBlocks.name"]', ticketName);
    await page.fill('input[name="ticketBlocks.size"]', ticketQuantity.toString());
    await page.click('[data-testid="ticket-form-save"]');
    console.log('Step 10: Ticket setup completed');

    console.log('Step 11: Navigating through final steps...');
    await page.waitForSelector('[data-testid="edit-event-next"]', { timeout: 20000 });  
    await page.waitForTimeout(2000);
    await page.click('[data-testid="edit-event-next"]');
    await page.waitForTimeout(2000);
    await page.click('[data-testid="edit-event-next"]');
    await page.waitForTimeout(2000);
    await page.click('[data-testid="edit-event-next"]');
    
    console.log('Step 12: Setting event status...');
    
    await page.getByLabel('Publish Event').click();    
    await page.getByRole('option', { name: 'Published', exact: true }).click();
  
    await page.click('text="Hide from Featured Events and public searches?"');
    await page.waitForTimeout(1000);
    console.log('Step 12: Event status set to published');

    console.log('Step 13: Saving event...');
    await page.waitForTimeout(1000);
    await page.click('[data-testid="edit-event-save"]');
    await page.waitForTimeout(1000);

    await page.waitForTimeout(1000);

    console.log('Step 14: Getting event details...');
    await page.waitForSelector('[data-testid="add-new-event"]', { timeout: 20000 });
    const thelist = await page.$$('[aria-label="more"]')
    await thelist[thelist.length - 1].click();
    await page.waitForSelector('li[role=menuitem]', { timeout: 20000 });

    const menuItems = await page.$$('li[role=menuitem]')    
    const shareMenuItem = await menuItems[1];
    console.log(`Share menu item text: ${await shareMenuItem.textContent()}`);
    await shareMenuItem.click();
    
    console.log('Step 15: Extracting event URL...');
    await page.waitForSelector('.MuiInputBase-readOnly input', { timeout: 20000 });
    
    let eventUrl = '';
    eventUrl = await page.$eval('.MuiInputBase-readOnly input', el => el.value || el.textContent);
    eventUrl = eventUrl.trim();
    
    const eventId = eventUrl.match(/\/events\/(\d+)/);
    const numericId = eventId ? eventId[1] : null;

    const result = {
      url: eventUrl,
      id: numericId,
    }

    console.log(`Step 16: Event details:`);
    console.log(`${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    console.log('Step 17: Closing browser...');
    await browser.close();
  }
}

module.exports = { createEvent }; 
