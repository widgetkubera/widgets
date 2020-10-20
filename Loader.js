define(() => {
	class Loader {
		constructor (loaderFunction) {
			this._result = null;
			this._listeners = [];
			this._isLoadEnd = false;
			this._isLoading = false;

			this._loaderFunction = loaderFunction;
			this._waitForEndPromise = new Promise((resolve, reject) => {
				this.eventForEachLoad((updatedData, fullData, isEnd) => {
					if (isEnd === true)		return resolve(fullData);
					if (isEnd !== false)	return reject(isEnd);
				});
			});
		}

		load (eventListener=false) {
			if (this._isLoadEnd === false && this._isLoading === false) {
				this._isLoading = true;
				setTimeout(e => {
					this._loaderFunction((data,fullData=false,isEnd=false) => {
						if (this._isLoadEnd === true)	return;

						if (isEnd === true) {
							this._isLoadEnd = true;
							this._isLoading = false;
							this._result = fullData;
						}

						for (let listener of this._listeners)
							setTimeout(e => listener(data,fullData,isEnd));

					}, (error=0) => {
						if (this._isLoadEnd === true)	return;

						this._isLoadEnd = true;
						this._isLoading = false;
						this._result = false;

						for (let listener of this._listeners)
							setTimeout(e => listener(false, false, error));	
					});
				});
			}

			if (eventListener !== false && typeof eventListener === "function")
				return this.eventForEachLoad(eventListener);
			return this.promiseForLoadEnd();
		}

		promiseForLoadEnd () {
			if (this._isLoadEnd === true)
				return Promise.resolve(this._result);
			return this._waitForEndPromise;
		}

		eventForEachLoad (listener=false) {
			if (listener !== false && typeof listener === "function")
				this._listeners.push(listener);
			return this;
		}

		forceReload (eventListener=false) {
			this._isLoadEnd = false;
			this._isLoading = false;

			this._waitForEndPromise = new Promise((resolve, reject) => {
				this.eventForEachLoad((updatedData, fullData, isEnd) => {

					if (isEnd === true)		return resolve(fullData);
					if (isEnd !== false)	return reject(isEnd);

				});
			});

			return this.load(eventListener);
		}
	}

	Loader.loaders = {};

	return Loader;
});