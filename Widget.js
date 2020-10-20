define(() => {
	class Widget {
		constructor () {
			this._isBinded = false;	
			this._isInited = false;
			this._dom = false;
		}

		init () {
			if (this._isInited === true)	return this;
			if (this.__init() !== false)
				this._isInited = true;
			return this;
		}

		bind () {
			if (this._isInited === false)	this.init();

			if (this._isBinded === true)	return this;
			this._isBinded = true;

			this.__bind();

			return this;
		}

		unbind () {
			if (this._isInited === false)	return this;
			if (this._isBinded === false)	return this;
			this._isBinded = false;

			this.__unbind();

			return this;
		}

		__init () { }
		__bind () { }
		__unbind () { }
	}

	return Widget;
});