const idFromQueryParam = (raw: string | string[]): number => {
  const id = parseInt(Array.isArray(raw) ? raw[0] : raw);
  return isNaN(id) ? 0 : id;
};

export default idFromQueryParam;
