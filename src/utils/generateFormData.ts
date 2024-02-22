const generateFormData = (formVals: any) => {
  const data = new FormData();
  for (const key in formVals) {
    data.append(key, formVals[key]);
  }
  return data;
};

export default generateFormData;
