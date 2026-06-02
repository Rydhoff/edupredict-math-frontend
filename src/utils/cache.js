export const getCache = (key) => {
  try {
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export const setCache = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeCache = (key) => {
  sessionStorage.removeItem(key);
};

export const clearStudentCache = () => {
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("student_")) {
      sessionStorage.removeItem(key);
    }
  });
};

export const clearTeacherCache = () => {
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("teacher_")) {
      sessionStorage.removeItem(key);
    }
  });
};