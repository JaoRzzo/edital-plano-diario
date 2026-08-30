// Função auxiliar para adicionar dias a uma data
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Função auxiliar para formatar data
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Função auxiliar para calcular horas totais disponíveis
function calculateTotalAvailableHours(hoursPerDay, availableDays, startDate, endDate) {
  let totalHours = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
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

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayOfWeek);
    
    if (daysArray.some(d => d === dayName || d === dayOfWeek.toString())) {
      totalHours += hoursPerDay;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return totalHours;
}

module.exports = {
  addDays,
  formatDate,
  calculateTotalAvailableHours,
};
