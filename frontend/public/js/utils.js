// Utilitários de formatação
const formatting = {
  formatDate(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('pt-BR');
  },

  formatTime(minutes) {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  },

  formatPercentage(value, total) {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  },

  getDayName(date) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return days[date.getDay()];
  },

  getTaskTypeLabel(type) {
    const labels = {
      novo: '📚 Novo',
      revisao: '🔄 Revisão',
      questoes: '❓ Questões',
    };
    return labels[type] || type;
  },
};

module.exports = formatting;
