/* global jest */
module.exports = {
  getAuth: jest.fn(() => ({ currentUser: null })),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  reload: jest.fn(),
  signOut: jest.fn(),
};
