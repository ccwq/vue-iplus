const dom2component = new Map;
export const getVueByDom = function(dom){
    return dom2component.get(dom);
}

// window.$$$ = getVueByDom;


export const mixin = {
    mounted() {
        const m = this;
        dom2component.set(m.$el, m);
    },

    beforeDestroy(){
        const m = this;
        dom2component.delete(m.$el);
    }
}


export default {
    install(Vue, options= {}){
        const {attachToWindow = true} = options;
        Vue.mixin(mixin);
        if (!Vue.$$$) {
            Vue.$$$ = getVueByDom;
        }

        if (!Vue.prototype.$$$) {
            Vue.prototype.$$$ = getVueByDom;
        }

        if (attachToWindow) {
            let win = typeof window;
            if (win != "undefined" && win!="null") {
                window.$$$ = getVueByDom;
            }
        }
    }
}