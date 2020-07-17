export default {
    name:"x-define",
    render(h){
        let {tag} = this.$attrs;
        if (tag) {
            return h(tag, {className:"define-x-tag"}, [this.$scopedSlots.default(this.$attrs)]);
        }else{
            return this.$scopedSlots.default(this.$attrs);
        }
    },
}


