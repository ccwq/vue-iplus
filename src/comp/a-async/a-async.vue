<template lang="pug">
    a-tag( :tag="tag" ).a-async-comp
        slot(
            name="default"
            :value="data"
            :handler="inputHandler"
        )

</template>
<script>
    import aTag from "../a-tag/a-tag.js";
    export default {
        name: "a-async",
        components: {aTag},
        data() {
            return {
                data: this.default,
            }
        },

        props:{
            tag:{
                type:String,
                default:"div"
            },

            default:{
                default:"",
            },

            //需要是一个promise
            value: {
                type:[Function, Promise]
            },
        },

        watch: {
            value(value) {
                const m = this;
                try {
                    if (typeof value == "function") {
                        value = value();
                    }
                    value.then(resp=>{
                        m.data = resp;
                    }).catch(err=>{
                        m.data = m.default;
                    })
                } catch (e) {
                    m.data = m.default;
                }
            }
        },


        methods: {
            inputHandler(value) {
                this.data = value;
                this.$emit("input", value);
            }
        },

    }
</script>
<style scoped lang="less">
    @import "vars";
    @import (reference) "luss";

    .async-comp {

    }
</style>
