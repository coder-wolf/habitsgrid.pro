//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-sEmQqjIG.js
var manifest = {
	"5df4f6d2eecf7d8582915e5d2837cb95e223d10e19b3f479fe72f87643bbc82d": {
		functionName: "cancelSubscription_createServerFn_handler",
		importer: () => import("./_ssr/cancel-subscription-BsBZwVQe.mjs")
	},
	"93a804ab06e45560dbb0c5e1f040dd61608b70d51751ea73b7cd35e81d73536d": {
		functionName: "createCheckoutSession_createServerFn_handler",
		importer: () => import("./_ssr/checkout-D0quu2co.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
