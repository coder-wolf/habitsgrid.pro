import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-sEmQqjIG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BGVtvA_y.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createCheckoutSession = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("93a804ab06e45560dbb0c5e1f040dd61608b70d51751ea73b7cd35e81d73536d"));
//#endregion
export { createSsrRpc as n, createCheckoutSession as t };
