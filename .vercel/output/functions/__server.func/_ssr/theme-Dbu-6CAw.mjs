import { r as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-Dbu-6CAw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = [
	"light",
	"sunset",
	"forest",
	"lavender",
	"pink",
	"midnight",
	"indigo",
	"teal",
	"charcoal",
	"cocoa"
];
var ThemeContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "habit-tracker-theme";
function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && THEMES.includes(stored)) return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "light";
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)(getInitialTheme);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		for (const t of THEMES) root.classList.remove(t);
		root.classList.add(theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		setTheme: setThemeState
	}), [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	const ctx = (0, import_react.useContext)(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
	return ctx;
}
//#endregion
export { useTheme as n, ThemeProvider as t };
