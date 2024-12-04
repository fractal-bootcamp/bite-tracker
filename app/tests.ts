import { formatDate } from "./utils/dates";

const mockDate = new Date("2024-03-20");
global.Date = class extends Date {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(mockDate);
    } else {
      super(...args);
    }
  }
} as DateConstructor;

// Test cases
const today = new Date("2024-03-20");
console.log(`Test 1: ${formatDate(today)} should be "Today"`);

const yesterday = new Date("2024-03-19");
console.log(`Test 2: ${formatDate(yesterday)} should be "Yesterday"`);

const threeDaysAgo = new Date("2024-03-17");
console.log(`Test 3: ${formatDate(threeDaysAgo)} should be "Sunday"`);

const fiveDaysAgo = new Date("2024-03-15");
console.log(`Test 4: ${formatDate(fiveDaysAgo)} should be "Friday"`);

const oldDate = new Date("2024-02-15");
console.log(`Test 5: ${formatDate(oldDate)} should be "February 15, 2024"`);

const veryOldDate = new Date("2023-12-25");
console.log(`Test 6: ${formatDate(veryOldDate)} should be "December 25, 2023"`);

// Restore original Date
global.Date = Date;
