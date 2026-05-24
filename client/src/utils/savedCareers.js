const STORAGE_KEY = 'savedCareers';

export const getSavedCareers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isCareerSaved = (id) => getSavedCareers().includes(id);

export const toggleSavedCareer = (id) => {
  const saved = getSavedCareers();
  const isSaved = saved.includes(id);
  const next = isSaved ? saved.filter((x) => x !== id) : [...saved, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('savedCareersUpdated'));
  return !isSaved;
};
