/**
 * 为实例增加一些在生命周期resolve的promise行程这样的语法
 * window.addEventListener("resize", handler)
 * this.__destroy.then(()=>window.removeEventListener("resize", handler))
 */

import BPromise from "ipro/src/promise/BPromise";
export default {
    beforeCreate() {
        const m = this;

        m.__destroy = new BPromise;
        m.__mounted = new BPromise;
        m.__created = new BPromise;
    },

    created(){
        if (this.__created) {
            this.__created._resolve();
        }
    },

    mounted(){
        if (this.__mounted) {
            this.__mounted._resolve();
        }
    },

    beforeDestroy(){
        if (this.__destroy) {
            this.__destroy._resolve();
        }
    },
}