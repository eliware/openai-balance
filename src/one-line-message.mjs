function toOneLineMessage(message) {
  return String(message).replace(/[\r\n]+/g, " ");
}

export { toOneLineMessage };
