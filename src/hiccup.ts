import { z } from "zod";

export const hiccupSchema = z.object({
  _hiccup: z.literal(1),
  type: z.string(),
  code: z.number(),
  message: z.string(),
});

export type Hiccup = Omit<z.infer<typeof hiccupSchema>, "_hiccup">;

interface HiccupDetails {
  type: string;
  message: string;
  code: number;
  details?: object;
}

export function hiccup(details: HiccupDetails): Hiccup {
  const { type, code, message } = details;

  const error = {
    _hiccup: 1,
    type: type,
    code: code,
    message: message,
  };

  return hiccupSchema.parse(error);
}

export function isHiccup(error: any): error is Hiccup {
  const result = hiccupSchema.safeParse(error);

  return result.success;
}

try {
  throw hiccup({
    type: "ValidationError",
    code: 400,
    message: "Invalid input data",
  });
} catch (err) {
  if (isHiccup(err)) {
    console.log("Caught a Hiccup error:", err.type, err.code, err.message);
  } else {
    console.log("Caught a general error:", err);
  }
}
