/*
export const fetchData = async (file) => {
  const response = await fetch(`api/data/${file}`);
  if (!response.ok) throw new Error(`Error loading ${file}`);
  return response.json();
};

export const saveData = async (file, data) => {
  const response = await fetch(`api/data/${file}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Error saving ${file}`);
  return response.json();
};
*/

const BASE_URL = import.meta.env.VITE_DATA_URL;

export const fetchData = async (file) => {
  const url =
    BASE_URL === "/data"
      ? `${BASE_URL}/${file}.json`
      : `${BASE_URL}/${file}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error loading ${file}`);
  }

  return response.json();
};

export const saveData = async (file, data) => {
  if (import.meta.env.PROD) {
    throw new Error("La aplicación está en modo de solo lectura.");
  }

  const response = await fetch(`${BASE_URL}/${file}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error saving ${file}`);
  }

  return response.json();
};