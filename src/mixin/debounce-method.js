import debounce from "lodash/debounce";

export default {
    beforeCreate() {
        const m = this;
        let obj = m.$options.debounce;
        Object.keys(obj||"").forEach(key=>{
            let funBody = obj[key];
            let [funName, wait] = key.split("_");
            wait = parseFloat(wait);
            if (isNaN(wait)) {
                wait = 300;
            }
            if (!m.$options) {
                m.$options = {};
            }
            m.$options.methods[funName] = debounce(funBody, wait);
        })
    }
}