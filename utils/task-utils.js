export const canRestartTask = (task) => {
  if (!task.completed_at || task.status !== 'completed') return false;
  
  const completedAt = new Date(task.completed_at);
  const now = new Date();
  
  switch (task.frequency?.toLowerCase()) {
    case 'five-minutes':
      const fiveMinInMs = 5 * 60 * 1000;
      return (now - completedAt) >= fiveMinInMs;
    
    case 'hourly':
      const hourInMs = 60 * 60 * 1000;
      return (now - completedAt) >= hourInMs;

    case 'daily':
      return completedAt.toDateString() !== now.toDateString();
    
    case 'weekly':
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      return (now - completedAt) >= weekInMs;
    
    case 'monthly':
      return completedAt.getMonth() !== now.getMonth() || 
             completedAt.getFullYear() !== now.getFullYear();
    
    default:
      return false;
  }
};

export const getNextAvailableTime = (task) => {
  if (!task.completed_at || canRestartTask(task)) return null;
  
  const completedAt = new Date(task.completed_at);
  
  switch (task.frequency?.toLowerCase()) {
    case 'five-minutes':
      const nextFiveMin = new Date(completedAt.getTime() + (5 * 60 * 1000));
      return nextFiveMin;
    
    case 'hourly':
      const nextHour = new Date(completedAt.getTime() + (60 * 60 * 1000));
      return nextHour;
      
    case 'daily':
      const nextDay = new Date(completedAt);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      return nextDay;
    
    case 'weekly':
      const nextWeek = new Date(completedAt);
      const day = nextWeek.getDay();
      const daysUntilNextMonday = ((8 - day) % 7) || 7;
      nextWeek.setDate(nextWeek.getDate() + daysUntilNextMonday);
      nextWeek.setHours(0, 0, 0, 0);
      return nextWeek;
    
    case 'monthly':
      const nextMonth = new Date(completedAt);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      return nextMonth;
    
    default:
      return null;
  }
};

export const formatNextAvailableDate = (nextAvailable) => {
  if (!nextAvailable) return '';
  
  const now = new Date();
  const isToday = nextAvailable.toDateString() === now.toDateString();
  const isTomorrow = nextAvailable.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  if (isToday) {
    return `Today at ${nextAvailable.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${nextAvailable.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  } else {
    return nextAvailable.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export const sortTasks = (tasks, sortBy, sortOrder) => {
  return [...tasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
        break;
      case 'completed_at':
        aValue = new Date(a.completed_at || 0);
        bValue = new Date(b.completed_at || 0);
        break;
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'frequency':
        const frequencyOrder = {
          'once': 0,
          'five-minutes': 1,
          'hourly': 2,
          'daily': 3,
          'weekly': 4,
          'monthly': 5,
        };
        
        aValue = frequencyOrder[a.frequency?.toLowerCase()] || 999;
        bValue = frequencyOrder[b.frequency?.toLowerCase()] || 999;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterTasksByStatus = (tasks, statuses) => {
  return tasks.filter(task => {
    if (statuses.includes(null) && (!task.status || task.status === '')) {
      return true;
    }
    return statuses.includes(task.status);
  });
};