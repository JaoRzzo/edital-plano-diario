const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateExamData = (data) => {
  const { name, exam_date } = data;
  if (!name || !exam_date) {
    throw new Error('Nome e data da prova são obrigatórios');
  }
  return true;
};

const validateSubjectData = (data) => {
  const { name, weight } = data;
  if (!name || weight === undefined) {
    throw new Error('Nome e peso da disciplina são obrigatórios');
  }
  if (isNaN(weight) || weight < 0 || weight > 1) {
    throw new Error('Peso deve ser um número entre 0 e 1');
  }
  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateExamData,
  validateSubjectData,
};
