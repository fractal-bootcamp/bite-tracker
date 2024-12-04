export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Add default export
export default {
  formatDate,
  isToday,
};
