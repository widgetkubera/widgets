define(['FETCH'],({FETCH}) => {

	class LazyLoader {
		_endObj () { return {isEnd:true}; }
		_urlFunc () { return "" }
		_parseFunc () { return [this._endObj()]; }
		_parsePage (args,page, startIndex) {
			return Promise.resolve( this._parseFunc(...args,page, startIndex) );
		}

		async *iterator (args,count=Infinity) {
			let i = 0;
			for(let page=0; true; page++) {
				let resultRows = await this._parsePage(args,page+1, i);
				for(let resultRow of resultRows) {

					if (i++<count)								yield resultRow;
					if (i>= count || resultRow.isEnd === true)	return;
				}
			}
		}

		async load (args,count=Infinity) {
			let result = [];
			for await(let ele of this.iterator(args,count))
				result.push(ele);
			return result;
		}
	}

	class LazyLoaderDocument extends LazyLoader {
		_parsePage (args,page) {
			return FETCH( this._urlFunc(...args,page) )
				.then(res => res.responseText)
				.then(text => {
					let doc = document.implementation.createHTMLDocument("New Document");
					doc.documentElement.innerHTML = text;
					return doc;
				})
				.then(doc => this._parseFunc(doc,...args,page));
		}
	}

	LazyLoader.LazyLoaderDocument = LazyLoaderDocument;
	define('LazyLoader/Document', () => LazyLoaderDocument);

	return LazyLoader;
});