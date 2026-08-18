export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeMarkdownV2(input: string): string {
  return input.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
