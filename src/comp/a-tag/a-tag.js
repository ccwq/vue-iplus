export default {
    name:"a-tag",
    props:{
        tag:{
            type:String,
            default:"div"
        }
    },

    render(h){
        const m = this;
        return h(
            m.tag,
            {},
            [
                this.$scopedSlots.default({
                    myScopedVariable: ''
                })
            ]
        )
    }
}