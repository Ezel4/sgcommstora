// -----------------------------------------------------------------------------
// Sanitization des contenus textuels de l'éditeur.
//
// Le rendu passe par React (échappement automatique), mais on refuse malgré
// tout tout HTML et tout caractère de contrôle à l'entrée : défense en
// profondeur appliquée côté client ET côté serveur avant persistance.
// -----------------------------------------------------------------------------

/** Motifs interdits même après suppression des balises (URLs js:, handlers…). */
const DANGEROUS_PATTERNS = [/javascript\s*:/i, /data\s*:\s*text\/html/i, /on\w+\s*=/i, /<\s*script/i];

/** Caractères de contrôle (hors \n et \t) supprimés systématiquement. */
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

/**
 * Nettoie un texte saisi ou proposé par l'IA : supprime les balises HTML et
 * les caractères de contrôle, normalise les fins de ligne, borne la longueur.
 */
export function sanitizeText(input: string, maxLength?: number): string {
  let text = input
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/[ \t]+\n/g, "\n");
  if (maxLength && text.length > maxLength) {
    text = text.slice(0, maxLength);
  }
  return text;
}

/** Vrai si le texte contient un motif dangereux qui doit être rejeté (pas nettoyé). */
export function containsDangerousContent(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

/** Tronque proprement à une limite, sans couper un mot quand c'est possible. */
export function truncateAtWord(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  const slice = input.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd();
}
