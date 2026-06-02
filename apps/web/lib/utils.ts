/** Simple classname merge utility (no tailwind-merge needed yet). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
