function applyShortOptions(token, flags, shortFlagMap, addInvalid) {
  for (const shortFlag of token.slice(1)) {
    const flagName = shortFlagMap[shortFlag];
    if (flagName) flags[flagName] = true;
    else addInvalid(`-${shortFlag}`);
  }
}

export { applyShortOptions };
