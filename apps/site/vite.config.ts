import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Vite doesn't read $PORT itself (unlike Next.js/Storybook); wire it up
    // explicitly so the harness's autoPort reassignment works here too.
    port: Number(process.env.PORT) || 5173,
  },
});
