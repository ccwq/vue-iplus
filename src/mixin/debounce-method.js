import debounce from "lodash/debounce";

export default {
    beforeCreate() {
        const m = this;
        let obj = m.$options.debounce;

        if (!m.$options) {
            m.$options = {};
        }

        let methods = m.$options.methods;
        if (!methods) {
            methods = {};
            m.$options.methods = methods;
        }

        Object.keys(obj||"").forEach(key=>{
            let funBody = obj[key];
            let [funName, wait] = key.split("_");
            wait = parseFloat(wait);
            if (isNaN(wait)) {
                wait = 300;
            }

            if (!methods[funName]) {
                methods[funName] = debounce(funBody, wait);
            }else{
                console.warn("创建debounce失败:"+funName);
            }
        })
    }
}