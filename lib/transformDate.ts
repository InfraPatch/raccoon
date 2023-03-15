export const transformDate = (date?: Date | string): string | undefined => {
  if (!date) {
    return undefined;
  }

  if (typeof date === 'string') {
    date = new Date(date);

    if (Number.isNaN(date.getTime())) {
      return undefined;
    }
  }

  return date.toJSON().slice(0, 10);
};
