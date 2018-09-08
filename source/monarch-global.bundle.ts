
import * as monarch from "."
import {initializeSlate} from "./slate/initialize-slate"
import {initializePropshop} from "./propshop/initialize-propshop"

const globals = {monarch, initializeSlate, initializePropshop}

for (const key of Object.keys(globals))
	window[key] = globals[key]
