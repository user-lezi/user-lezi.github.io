export function parseMarkdown(input: string): string {
  const codeBlocks: string[] = [];

  // Escape HTML first
  let text = escapeHtml(input)
    // Extract inline code so we don't parse inside it
    .replace(/`([^`]+?)`/g, (_, code) => {
      const token = `%%CODE_${codeBlocks.length}%%`;
      codeBlocks.push(`<code>${code}</code>`);
      return token;
    })
    // Bold (**text**)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic (*text*)
    .replace(/(^|[^*])\*(.+?)\*(?!\*)/g, "$1<em>$2</em>")
    // Strikethrough (~~text~~)
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    // Links
    .replace(
      /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    // Line breaks
    .replace(/\n/g, "<br>");

  // Restore inline code
  codeBlocks.forEach((block, i) => {
    text = text.replace(`%%CODE_${i}%%`, block);
  });

  return text;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
