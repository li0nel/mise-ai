export type RichTextSegment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "ingredient"; content: string }
  | { type: "timer"; content: string; duration: string };
