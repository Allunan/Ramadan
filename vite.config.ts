import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), glsl(), svgr()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
});
