import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => { refreshUserList(); }, []);

  const refreshUserList = async () => {
    const usersData = await AsyncStorage.getItem('users');
    if (usersData) setAllUsers(JSON.parse(usersData));
  };

  // --- 1. SIGNUP ---
  const signup = async (username, password) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    if (users.find(u => u.username === username)) return alert('Username taken!');
    
    users.push({ username, password });
    await AsyncStorage.setItem('users', JSON.stringify(users));
    refreshUserList();
    alert('Account created! Login now.');
    return true;
  };

  // --- 2. NORMAL LOGIN (Password wala) ---
  const login = async (username, password) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      loadNotes(foundUser.username);
      return true;
    } else {
      alert('Wrong password!');
      return false;
    }
  };

  // --- 3. BIOMETRIC LOGIN (Bina Password wala) ---
  const loginWithBiometrics = async (username) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const foundUser = users.find(u => u.username === username);

    if (foundUser) {
      setUser(foundUser); // Login successful
      loadNotes(foundUser.username);
      return true;
    } else {
      alert('User not found. Create account first.');
      return false;
    }
  };

  // --- 4. SWITCH ACCOUNT (Direct Switch) ---
  const switchAccount = async (targetUsername) => {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const foundUser = users.find(u => u.username === targetUsername);

    if (foundUser) {
      setUser(foundUser); // User state update
      loadNotes(foundUser.username); // Notes reload
      // No navigation needed, React will re-render Home with new data
    }
  };

  const logout = () => { setUser(null); setNotes([]); };

  const loadNotes = async (username) => {
    const allNotesData = await AsyncStorage.getItem('pro_notes');
    const allNotes = allNotesData ? JSON.parse(allNotesData) : [];
    setNotes(allNotes.filter(n => n.owner === username).sort((a,b) => b.id - a.id));
  };

  const saveNote = async (note) => {
    const allNotesData = await AsyncStorage.getItem('pro_notes');
    let allNotes = allNotesData ? JSON.parse(allNotesData) : [];
    const notePayload = { ...note, id: note.id || Date.now(), owner: user.username, color: note.color || '#1c1c1e', date: new Date().toISOString() };

    if (note.id) allNotes = allNotes.map(n => (n.id === note.id ? notePayload : n));
    else allNotes.push(notePayload);

    await AsyncStorage.setItem('pro_notes', JSON.stringify(allNotes));
    loadNotes(user.username);
  };

  const deleteNote = async (id) => {
    const allNotesData = await AsyncStorage.getItem('pro_notes');
    let allNotes = allNotesData ? JSON.parse(allNotesData) : [];
    allNotes = allNotes.filter(n => n.id !== id);
    await AsyncStorage.setItem('pro_notes', JSON.stringify(allNotes));
    loadNotes(user.username);
  };

  return (
    <AppContext.Provider value={{ user, allUsers, signup, login, loginWithBiometrics, switchAccount, logout, notes, saveNote, deleteNote }}>
      {children}
    </AppContext.Provider>
  );
};