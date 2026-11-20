import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "devhire-users";
const SESSION_KEY = "devhire-current-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function register({ name, email, password, role, company }) {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      company: company?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const sessionUser = { ...newUser };
    delete sessionUser.password;

    setUser(sessionUser);
    return sessionUser;
  }

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const account = getUsers().find(
      (item) => item.email === normalizedEmail && item.password === password,
    );

    if (!account) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = { ...account };
    delete sessionUser.password;

    setUser(sessionUser);
    return sessionUser;
  }

  function logout() {
    setUser(null);
  }

  function updatePassword(email, newPassword) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();

    const accountExists = users.some((item) => item.email === normalizedEmail);

    if (!accountExists) {
      throw new Error("No account was found with this email.");
    }

    const updatedUsers = users.map((item) =>
      item.email === normalizedEmail
        ? { ...item, password: newPassword }
        : item,
    );

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
