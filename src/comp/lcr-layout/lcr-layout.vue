<style scoped type="text/css">
    .lcr-layout-comp{
        display: flex;
        align-items: stretch;
        box-sizing: border-box;
    }
</style>
<template>
    <div class="lcr-layout-comp"><slot></slot></div>
</template>
<script>
    import isPlainObject from "lodash/isPlainObject";

    const nameLs = [
        "left",
        "center",
        "right",
    ]

    export default {
        name: "lcr-layout",
        data() {
            return {

            }
        },

        props:{



            /**
             * 通过该数据可以设置为n列
             */
            widthLs:{
                default:"",
                type:[String, Array],
            },
        },

        computed:{
            attrLs(){
                return this.lcrWidthStyles.map((el, index)=>{
                    return {
                        css:el,
                        name: nameLs[index],
                        className:"lcr-" + nameLs[index],
                        indexName: "col" + (index + 1)
                    }
                })
            },

            widthLs10(){
                const m = this;
                let ls = m.widthLs;
                if(typeof ls === "string"){
                    if(!ls){
                        return [];
                    }
                    return ls.split(",").map(el => parseFloat(el));
                }

                return ls;
            },


            lcrWidthStyles(){
                return (this.widthLs10).map(el=>{
                    if (isPlainObject(el)) {
                        return el;
                    }else{
                        if(el>1){
                            return {width: el + "px"}
                        }else{
                            return {flex: el};
                        }
                    }
                })
            }
        },

        watch: {
            attrLs: {
                immediate: true,
                handler(ls){
                    this.calcWidth();
                }
            }
        },

        methods: {
            calcWidth() {
                const m = this;
                if (!m.$el) {
                    return;
                }


                for(var i=0; i<m.$el.children.length; i++){
                    let el = m.$el.children[i];

                    el.style.flex = "";
                    el.style.width = "";

                    let css = m.attrLs?.[i]?.css;

                    if (css) {
                        Object.keys(css).forEach(key=>{
                            el.style[key] = css[key];
                        });
                    }else{
                        el.style.flex = "1";
                    }
                }
            }
        },

        mounted() {
            this.calcWidth();
        }
    }
</script>
