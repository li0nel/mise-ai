/* global jest */
module.exports = {
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  addDoc: jest.fn(() => Promise.resolve({ id: "mock-doc-id" })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(() => jest.fn()),
  orderBy: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  serverTimestamp: jest.fn(() => ({ _type: "serverTimestamp" })),
};
