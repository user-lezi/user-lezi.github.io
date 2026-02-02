export function parseMarkdown(input: string): string {
  return (
    escapeHtml(input)
      // inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // bold
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      // italic
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // links
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // line breaks
      .replace(/\n/g, "<br>")
  );
}
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
