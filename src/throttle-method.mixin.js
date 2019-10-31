import {throttle} from "lodash";

export default {
    beforeCreate() {
        const m = this;
        let obj = m.$options.throttle;
        Object.keys(obj||"").forEach(key=>{
            let funBody = obj[key];
            let [funName, wait] = key.split("_");
            wait = parseFloat(wait);
            if (isNaN(wait)) {
                wait = 300;
            }
            m[funName] = throttle(funBody.bind(m), wait);
        })
    }
}