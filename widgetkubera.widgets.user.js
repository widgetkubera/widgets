// ==UserScript==
// @name     widgetkubera widgets loader
// @include	 *
// @version  1
// @grant    GM.xmlHttpRequest
// @grant    GM_xmlHttpRequest
// @require  https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
// @require  https://polyfill.io/v3/polyfill.js?features=fetc
// ==/UserScript==

requirejs.config({
	baseUrl: 'https://raw.githubusercontent.com/widgetkubera/widgets/master/',
});

define('Promise', () => Promise);
define('FETCH', function () {

	const GMxmlHttpRequest = GM_xmlHttpRequest ? GM_xmlHttpRequest : GM.xmlHttpRequest;
	
	async function FETCH (data={}) {
		return new Promise((load,err) => {
			data.onload = load;
			data.onerror = data.onabort = data.ontimeout = function (e) { console.error(e); err(e); };
			GMxmlHttpRequest (data);
		});
	}

	async function GET (url) {
		return (await FETCH({method:"GET", url:url})).response;
	}


	return {
		FETCH,
		GET,
		RAW : GMxmlHttpRequest,
	};
});

require(['FETCH','Promise','Loader'], (FETCH,Promise,Loader) => {
	console.log(FETCH, Promise, Loader);

	window.open('https://raw.githubusercontent.com/widgetkubera/widgets/master/widgetkubera.widgets.user.js');
});


