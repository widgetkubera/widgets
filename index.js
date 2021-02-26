define(['config.baseUrl'],(baseUrl) => {
	const hostname = location.hostname.split('.')
	const completePath = [...hostname].reverse().join("/")+"/";
	const domainPath = [...hostname].slice(1, hostname.length).reverse().join("/")+"/";

	define('config.completePath', () => baseUrl+completePath);
	define('config.domainPath', () => baseUrl+domainPath);

	setTimeout(() => require([domainPath+'index']),100);
	setTimeout(() => require([completePath+'index']),200);
});
