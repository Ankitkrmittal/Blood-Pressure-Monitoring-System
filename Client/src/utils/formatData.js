export const formatProfileData = (data) => {
  const formatted = { ...data };

  // convert number fields
  if (data.age) formatted.age = Number(data.age);
  if (data.weight) formatted.weight = Number(data.weight);
  if (data.height) formatted.height = Number(data.height);

  // boolean
  if (data.isSmoker !== undefined) {
    formatted.isSmoker = data.isSmoker === "true" || data.isSmoker === true;
  }

  // array fields
  if (typeof data.exerciseTypes === "string") {
    formatted.exerciseTypes = data.exerciseTypes.split(",");
  }

  if (typeof data.medicalConditions === "string") {
    formatted.medicalConditions = data.medicalConditions.split(",");
  }

  return formatted;
};