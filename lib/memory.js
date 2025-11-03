// lib/memory.js
// Simple in-memory storage for chat history
// TODO: Replace with Redis for production scaling

const memoryStore = new Map();

export function getMemory(userId, agent, lastN = 6) {
  const key = `${userId}::${agent}`;
  const history = memoryStore.get(key) || [];
  return history.slice(-lastN);
}

export function setMemory(userId, agent, role, content) {
  const key = `${userId}::${agent}`;
  const history = memoryStore.get(key) || [];
  
  // Add new message
  history.push({ role, content });
  
  // Keep only last 6 messages (3 user + 3 assistant)
  if (history.length > 6) {
    history.splice(0, history.length - 6);
  }
  
  memoryStore.set(key, history);
}

// Helper to clear memory for a user/agent
export function clearMemory(userId, agent) {
  const key = `${userId}::${agent}`;
  memoryStore.delete(key);
}

// Helper to get all active sessions (for debugging)
export function getActiveKeys() {
  return Array.from(memoryStore.keys());
}