export const objectToXml = (object) =>
  Object.keys(object).reduce((reqStr, key) => {
    const value = object[key] || '';
    const isObject = typeof value === 'object';
    const isArray = Array.isArray(value);
    if (isArray) {
      return (
        reqStr +
        value.reduce(
          (accumulator, currentValue) =>
            accumulator +
            `<${key}>${
              typeof currentValue === 'object'
                ? objectToXml(currentValue)
                : currentValue || ''
            }</${key}>`,
          '',
        )
      );
    }
    if (isObject) {
      return reqStr + `<${key}>${objectToXml(value)}</${key}>`;
    }
    return reqStr + `<${key}>${value}</${key}>`;
  }, '');

export const jsonToXml = (object) => {
  return '<?xml version="1.0" encoding="UTF-8" ?>' + objectToXml(object);
};
