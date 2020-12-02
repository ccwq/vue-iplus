import debounce from "lodash/debounce";

export default {
    mounted() {
        const m = this;

        dom2component.set(m.$el, m);
        m._destroy.then(__=>{
            dom2component.delete(m.$el);
        })
    },
}