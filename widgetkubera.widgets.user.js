// ==UserScript==
// @name     widgetkubera widgets loader
// @include	 *
// @version  1
// @grant    GM.xmlHttpRequest
// @grant    GM_xmlHttpRequest
// @require  https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
// ==/UserScript==

requirejs.config({
	baseUrl: 'https://raw.githubusercontent.com/widgetkubera/widgets/main/',
});
requirejs.onError = (error) => console.error(error);

define('Promise',() => Promise);
define('FETCH',['Promise'], function (Promise) {
	var GMxmlHttpRequest = null;

	try 		GMxmlHttpRequest = GM_xmlHttpRequest;
	catch (e)	GMxmlHttpRequest = GM.xmlHttpRequest;
	
	function FETCH (data={}) {
		return new Promise((load,err) => {
			data.onload = load;
			data.onerror = data.onabort = data.ontimeout = function (e) { console.error(e); err(e); };
			GMxmlHttpRequest (data);
		});
	}

	function GET (url) {
		return FETCH({method:"GET", url:url}).then(res => res.response);
	}

	requirejs.load = ((load) => {//enable cross domain loading
		return function (context, moduleName, url) {
			GET(url).then(text => {
				eval(text);
				context.completeLoad(moduleName);
			}).catch(err => load(context, moduleName, url));
		};
	})(requirejs.load);

	return {
		FETCH,
		GET,
		RAW : GMxmlHttpRequest,
	};
});

requirejs(['index.js'], function () { });