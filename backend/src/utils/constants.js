// Intervalos de revisão espaçada (em dias)
const SPACED_REPETITION_INTERVALS = {
  first: 1,     // 1 dia após estudo novo
  second: 3,    // 3 dias após primeira revisão
  third: 7,     // 7 dias após segunda revisão
  fourth: 15,   // 15 dias após terceira revisão
};

// Percentual de tempo dedicado a questões
const QUESTIONS_TIME_PERCENTAGE = 0.25; // 25% do tempo total

// Tipos de tarefas
const TASK_TYPES = {
  NEW: 'novo',
  REVIEW: 'revisao',
  QUESTIONS: 'questoes',
};

// Status de tarefas
const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
};

// Níveis de base
const BASE_LEVELS = {
  BEGINNER: 'iniciante',
  INTERMEDIATE: 'intermediário',
  ADVANCED: 'avançado',
};

module.exports = {
  SPACED_REPETITION_INTERVALS,
  QUESTIONS_TIME_PERCENTAGE,
  TASK_TYPES,
  TASK_STATUS,
  BASE_LEVELS,
};
