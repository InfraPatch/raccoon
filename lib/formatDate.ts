import { format } from 'date-fns';

export const formatDate = (date: string | Date, compact: boolean = true): string => {
  const parsedDate = new Date(date);

  if (!(parsedDate instanceof Date) || !isFinite(parsedDate.getTime())) {
    return `${date}`;
  }

  console.log(parsedDate);

  if (compact) {
    return format(parsedDate, 'Y/MM/dd');
  }

  return format(parsedDate, 'Y/MM/dd HH:mm');
};
