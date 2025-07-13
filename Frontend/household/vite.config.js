import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // change to 5173 or 5174 in other projects
    allowedHosts: [".ngrok-free.app"], // ✅ Allow external access via ngrok
    cors: true, // ✅ Enable CORS
    //origin: "https://4830522e69fa.ngrok-free.app", // optional, but good
  },
});
