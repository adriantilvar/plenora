/** biome-ignore-all lint/style/noProcessEnv: Only place where we use process.env directly */
import { styleText } from "node:util";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
});

let env: z.infer<typeof EnvSchema>;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  console.error(
    styleText(["red"], "ERROR"),
    "Server environment variables are not valid",
  );
  console.error(`${z.prettifyError(e as z.ZodError)}\n`);
  process.exit(1);
}

export default env;
