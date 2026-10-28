export function truncateText(text: string, maxLength = 100): string {
  if (maxLength <= 0) return '';

  // Count Unicode code points so surrogate-pair characters are not split in half.
  const characters = Array.from(text);

  if (characters.length <= maxLength) {
    return text;
  }

  // Reserve one character for the ellipsis, keeping the preview within maxLength.
  return `${characters
    .slice(0, maxLength - 1)
    .join('')
    .trimEnd()}…`;
}
