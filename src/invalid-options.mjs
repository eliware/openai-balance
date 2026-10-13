function createInvalidOptions() {
  const invalidOptions = [];
  return {
    add(option) {
      if (!invalidOptions.includes(option)) invalidOptions.push(option);
    },
    values: invalidOptions,
  };
}

export { createInvalidOptions };
