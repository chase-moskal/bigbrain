
export class Priority {
	private _time = Date.now()
	private _flag = false
	private _value = undefined

	set value(v: any) {
		this._flag = true
		this._value = v
	}

	get value() {
		return this._value
	}

	constructor(public readonly importance = 50) {}

	poll() {
		if (this._flag) {
			const now = Date.now()
			const since = now - this._time
			const weight = since * this.importance
			this._flag = false
			return {weight, value: this._value}
		}
		else return null
	}
}
