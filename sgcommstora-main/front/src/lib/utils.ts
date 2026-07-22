/**
 * cn — concatène des classes conditionnelles sans dépendance externe.
 * Accepte strings, falsy (ignoré) et objets { classe: boolean }.
 *
 *   cn("px-4", isActive && "bg-forest", { "opacity-50": disabled })
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | Record<string, boolean | undefined | null>;

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      continue;
    }

    for (const [key, value] of Object.entries(input)) {
      if (value) classes.push(key);
    }
  }

  return classes.join(" ");
}
