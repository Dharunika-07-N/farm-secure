import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    });
});
