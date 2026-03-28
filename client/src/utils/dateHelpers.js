import { format, startOfMonth, endOfMonth, addMonths, subMonths, parseISO } from 'date-fns';

export const getCurrentMonth = () => format(new Date(), 'yyyy-MM');

export const getMonthDisplay = (monthStr) => {
  const date = parseISO(`${monthStr}-01`);
  return format(date, 'MMMM yyyy');
};

export const getNextMonth = (monthStr) => {
  const date = parseISO(`${monthStr}-01`);
  return format(addMonths(date, 1), 'yyyy-MM');
};

export const getPrevMonth = (monthStr) => {
  const date = parseISO(`${monthStr}-01`);
  return format(subMonths(date, 1), 'yyyy-MM');
};

export const formatDate = (date) => {
  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
};

export const getMonthRange = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return { start, end };
};

export const getDaysInMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month, 0).getDate();
};

export const getLast6Months = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'yyyy-MM'));
  }
  return months;
};
