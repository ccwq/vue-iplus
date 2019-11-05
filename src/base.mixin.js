import merge from "lodash/merge";
import _debounce from "./debounce-method.mixin.js";
import _throttle from "./throttle-method.mixin.js";


//整体的
export default merge(
    {

    },
    _debounce,
    _throttle,
)