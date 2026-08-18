function uniqueID() {
  return Math.random().toString(36).substring(2, 12);
}

export default uniqueID;
