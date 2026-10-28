export function truncateText(text: string, maxLength = 100): string {
  if (maxLength <= 0) return '';

  const characters = Array.from(text);

  if (characters.length <= maxLength) {
    return text;
  }

  return `${characters
    .slice(0, maxLength - 1)
    .join('')
    .trimEnd()}…`;
}
