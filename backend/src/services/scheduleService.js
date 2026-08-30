const pool = require('../models/db');
const logger = require('../utils/logger');
const { SPACED_REPETITION_INTERVALS, QUESTIONS_TIME_PERCENTAGE, TASK_TYPES } = require('../utils/constants');
const { addDays, formatDate, calculateTotalAvailableHours } = require('../utils/helpers');

class ScheduleService {
  /**
   * Gera cronograma de estudo baseado no plano de estudo
   * @param {string} examId - ID do concurso
   * @param {Date} examDate - Data da prova
   * @param {number} hoursPerDay - Horas disponíveis por dia
   * @param {array|string} availableDays - Dias disponíveis da semana
   * @param {array} subjects - Array de disciplinas com tópicos
   * @returns {array} Lista de tarefas geradas
   */
  async generateSchedule(examId, examDate, hoursPerDay, availableDays, subjects) {
    try {
      const tasks = [];
      const today = new Date();
      const totalAvailableHours = calculateTotalAvailableHours(
        hoursPerDay,
        availableDays,
        today,
        examDate
      );

      // Calcular tempo total necessário para todos os tópicos
      let totalTopicHours = 0;
      let totalTopics = 0;
      const allTopics = [];

      for (const subject of subjects) {
        const topicsResult = await pool.query(
          'SELECT id, name, estimated_hours FROM topics WHERE subject_id = $1 ORDER BY created_at',
          [subject.id]
        );
        topicsResult.rows.forEach(topic => {
          allTopics.push({ ...topic, subjectId: subject.id });
          totalTopicHours += parseFloat(topic.estimated_hours);
          totalTopics++;
        });
      }

      // Calcular tempo para novo aprendizado vs questões
      const newLearningHours = totalAvailableHours * (1 - QUESTIONS_TIME_PERCENTAGE);
      const questionsHours = totalAvailableHours * QUESTIONS_TIME_PERCENTAGE;

      logger.info(`Total de horas disponíveis: ${totalAvailableHours}, horas de aprendizado: ${newLearningHours}`);

      // Distribuir tópicos ao longo do tempo
      let currentDate = new Date(today);
      const hoursPerTopic = newLearningHours / totalTopics;

      // 1. Adicionar tarefas de estudo novo
      for (const topic of allTopics) {
        // Encontrar próximo dia disponível
        currentDate = this.getNextAvailableDay(currentDate, availableDays);

        // Inserir tarefa de estudo novo
        tasks.push({
          examId,
          topicId: topic.id,
          type: TASK_TYPES.NEW,
          plannedDate: formatDate(currentDate),
        });

        // Adicionar revisões espaçadas para este tópico
        this.addSpacedReviews(tasks, examId, topic.id, currentDate, examDate);

        // Avançar para o próximo dia (considerando carga horária)
        const daysToAdd = Math.ceil(topic.estimated_hours / hoursPerDay);
        currentDate = addDays(currentDate, daysToAdd);
      }

      // 2. Adicionar blocos de questões regularmente
      this.addQuestionTasks(tasks, examId, subjects, today, examDate, questionsHours);

      logger.info(`Cronograma gerado com ${tasks.length} tarefas`);
      return tasks;
    } catch (error) {
      logger.error('Erro ao gerar cronograma:', error);
      throw error;
    }
  }

  /**
   * Encontra o próximo dia disponível da semana
   */
  getNextAvailableDay(startDate, availableDays) {
    const daysArray = typeof availableDays === 'string'
      ? availableDays.split(',').map(d => d.trim().toLowerCase())
      : availableDays;

    const dayMap = {
      'monday': 1, 'segunda': 1,
      'tuesday': 2, 'terça': 2,
      'wednesday': 3, 'quarta': 3,
      'thursday': 4, 'quinta': 4,
      'friday': 5, 'sexta': 5,
      'saturday': 6, 'sábado': 6,
      'sunday': 0, 'domingo': 0,
    };

    let current = new Date(startDate);
    while (true) {
      const dayOfWeek = current.getDay();
      if (daysArray.some(d => dayMap[d] === dayOfWeek)) {
        return current;
      }
      current = addDays(current, 1);
    }
  }

  /**
   * Adiciona revisões espaçadas para um tópico
   */
  addSpacedReviews(tasks, examId, topicId, studyDate, examDate) {
    Object.entries(SPACED_REPETITION_INTERVALS).forEach(([key, days]) => {
      const reviewDate = addDays(studyDate, days);
      if (reviewDate <= examDate) {
        tasks.push({
          examId,
          topicId,
          type: TASK_TYPES.REVIEW,
          plannedDate: formatDate(reviewDate),
        });
      }
    });
  }

  /**
   * Adiciona tarefas de questões regularmente
   */
  addQuestionTasks(tasks, examId, subjects, startDate, endDate, totalHours) {
    // Distribuir questões ao longo do tempo (por exemplo, 1 sessão a cada 3 dias)
    let current = addDays(startDate, 3);
    while (current <= endDate) {
      for (const subject of subjects) {
        tasks.push({
          examId,
          topicId: null,
          type: TASK_TYPES.QUESTIONS,
          plannedDate: formatDate(current),
          metadata: { subjectId: subject.id },
        });
      }
      current = addDays(current, 3);
    }
  }

  /**
   * Ajusta cronograma em caso de atraso
   */
  async adjustScheduleForDelay(examId, delayDays) {
    try {
      logger.info(`Ajustando cronograma do exame ${examId} com atraso de ${delayDays} dias`);
      
      // Buscar todas as tarefas pendentes
      const result = await pool.query(
        `SELECT id, planned_date FROM tasks 
         WHERE exam_id = $1 AND status = 'pending'
         ORDER BY planned_date ASC`,
        [examId]
      );

      // Reempilhar tarefas mantendo ordem de prioridade
      for (const task of result.rows) {
        const newDate = addDays(new Date(task.planned_date), delayDays);
        await pool.query(
          'UPDATE tasks SET planned_date = $1 WHERE id = $2',
          [formatDate(newDate), task.id]
        );
      }

      logger.info(`Cronograma ajustado com sucesso`);
    } catch (error) {
      logger.error('Erro ao ajustar cronograma:', error);
      throw error;
    }
  }
}

module.exports = new ScheduleService();
