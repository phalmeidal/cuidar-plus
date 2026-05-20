const USERS_KEY = 'cuidar_plus_users';
const SESSION_KEY = 'cuidar_plus_session';

export const adminCredentials = {
  email: 'admin@cuidar.plus',
  password: 'CuidarAdmin@2026',
};

const defaultUsers = [
  {
    id: 'admin-001',
    name: 'Administrador Cuidar+',
    email: adminCredentials.email,
    password: adminCredentials.password,
    role: 'admin',
    phone: '(00) 00000-0000',
    monitoredPerson: 'Todos os usuarios',
    createdAt: '2026-05-20',
  },
];

function readUsers() {
  const storedUsers = window.localStorage.getItem(USERS_KEY);
  if (!storedUsers) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  const users = JSON.parse(storedUsers);
  const hasAdmin = users.some((user) => user.email === adminCredentials.email);

  if (hasAdmin) {
    return users;
  }

  const updatedUsers = [...defaultUsers, ...users];
  window.localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  return updatedUsers;
}

function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function getCurrentUser() {
  const session = window.localStorage.getItem(SESSION_KEY);
  if (!session) {
    return null;
  }

  return JSON.parse(session);
}

export function login({ email, password }) {
  const users = readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
  );

  if (!user) {
    throw new Error('E-mail ou senha incorretos.');
  }

  const publicUser = toPublicUser(user);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function register({ name, email, password, phone, monitoredPerson }) {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const alreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

  if (alreadyExists) {
    throw new Error('Este e-mail ja possui cadastro.');
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'user',
    phone: phone.trim() || 'Nao informado',
    monitoredPerson: monitoredPerson.trim() || 'Pessoa monitorada',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const updatedUsers = [...users, newUser];
  window.localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  const publicUser = toPublicUser(newUser);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function logout() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getUsersSummary() {
  const users = readUsers();
  return {
    totalUsers: users.length,
    admins: users.filter((user) => user.role === 'admin').length,
    caregivers: users.filter((user) => user.role === 'user').length,
  };
}
