export const loginAdmin = (email: string, password: string): boolean => {
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "admin123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdminLoggedIn", "true");
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  localStorage.removeItem("isAdminLoggedIn");
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem("isAdminLoggedIn") === "true";
};
