/**
 * Get `T` item list according to `get` function.
 * @param fileNames List of file names.
 * @param get Function to invoke.
 * @returns List of `T`.
 */
function getAllItems<T>(fileNames: string[], get: (name: string) => T): T[] {
  return fileNames.map((name) => get(name));
}

export { getAllItems };
