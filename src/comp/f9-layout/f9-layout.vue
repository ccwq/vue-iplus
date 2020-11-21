<template lang="pug">
    .f9-layout-comp(:class="[type]" :style="elStyle")
        .bg
            div(
                v-for="url, index in urlLs"
                :key="url"
                v-bind="bindLs[index]"
            )

        slot

</template>
<script>
    import imageSize from "browser-image-size";
    import get from "lodash/get";
    import compact from "lodash/compact"
    const classMap9 = {
        0:"l t",
        1:"c t",
        2:"r t",
        3:"l m",
        4:"c m",
        5:"r m",
        6:"l b",
        7:"c b",
        8:"r b",
    }




    const classMap3h = {0:"l", 1:"c", 2:"r"};
    const classMap3v = {0:"t", 1:"m", 2:"b"};


    const CLASS_MAP_LIST = {classMap9, classMap3h, classMap3v};


    export default {
        name: "f9-layout",

        data() {
            return {
                sizeLs:[],
            }
        },

        props: {
            /**
             * 文件名序列起始数
             */
            startNum:{
                type:Number,
                default:1,
                validator(v) {
                    return v==0 || v==1;
                }
            },
            urlList: {
                type:[Array],
                default() {
                    return [];
                },
                validator(v) {
                    return v.length == 0 || (Array.isArray(v) && v.length == 9);
                }
            },

            urlPatten:{
                type:String,
                default:"",
            },


            type: {
                type:String,
                default:"9",
                validator(type) {
                    return ["9", "3h", "3v"].includes(type);
                }
            }
        },
        computed: {
            ...Array(3).fill(1).reduce((ret, el, index)=>{
                ret[`col_w_${index + 1}`] = function(){
                    return get(this.sizeLs, index + ".width", 0)
                };
                ret[`row_h_${index + 1}`] = function(){
                    if (this.type == "9") {
                        return get(this.sizeLs, (index * 3) + ".height", 0);
                    }else{
                        return get(this.sizeLs, (index) + ".height", 0);
                    }
                };

                return ret;
            }, {}),


            /**
             * 整体高度
             * @returns {*}
             */
            minWidth() {
                if (this.type == "3v") {
                    return this.col_w_1;
                }

                return this.col_w_1 + this.col_w_3;
            },


            /**
             * 整体宽度
             * @returns {*}
             */
            minHeight() {
                if (this.type == "3h") {
                    return this.row_h_1;
                }

                return this.row_h_1 + this.row_h_3;
            },

            
            elStyle() {
                const m = this;
                let ret = {};
                if (m.minWidth) {
                    ret["min-width"] = m.minWidth + "px";
                }
                if (m.minHeight) {
                    ret["min-height"] = m.minHeight + "px";
                }

                return ret;
            },


            urlLs() {
                const m = this;
                if (m.urlList.length) {
                    return m.urlList;
                }else{
                    return Array(m.type=="9"?9:3).fill(1).map((el, index)=>{
                        return m.urlPatten.replace(/\[index\]/g, index + m.startNum )
                    })
                }
            },

            bindLs() {
                const m = this;
                let classMap = CLASS_MAP_LIST["classMap" + m.type];
                return m.urlLs.map((url, index)=>{

                    let className = classMap[index];

                    let ret =  {
                        style:{
                            backgroundImage:`url(${url})`,
                        },
                        class: [className],
                    }


                    let width = 0, height = 0;


                    if (className.indexOf("l")!=-1) {
                        width = m.col_w_1;
                    }
                    if (className.indexOf("c")!=-1) {
                        //width = m.col_w_2;
                        ret.style.left = m.col_w_1 + "px";
                        ret.style.right = m.col_w_3 + "px";
                    }
                    if (className.indexOf("r")!=-1) {
                        width = m.col_w_3;
                    }
                    if (className.indexOf("t")!=-1) {
                        height = m.row_h_1;
                    }
                    if (className.indexOf("m")!=-1) {
                        //height = m.row_h_2;
                        ret.style.top = m.row_h_1 + "px";
                        ret.style.bottom = m.row_h_3 + "px";
                    }
                    if (className.indexOf("b")!=-1) {
                        height = m.row_h_3;
                    }

                    if (m.type == "3v") {
                        height = m.col_l_1;
                    }

                    if (m.type == "3h") {
                        height = m.row_h_1;
                    }


                    //
                    if (width) {
                        ret.style.width = width + "px";
                    }
                    if (height) {
                        ret.style.height = height + "px";
                    }

                    return ret;
                })
            },


        },

        watch: {
            urlLs: {
                immediate: true,
                handler(uLs) {
                    const m = this;

                    uLs = compact(uLs);

                    if (!uLs.length) {
                        return;
                    }

                    Promise.all(m.urlLs.map(url=>imageSize(url).catch(__=>{})))
                        .then(sizeLs=>{
                            m.sizeLs = sizeLs;
                            m.sizeReady()
                        })
                    ;
                }
            },
            sizeLs() {
                const m = this;
            }
        },

        methods: {
            sizeReady() {
                const m = this;
            }
        },

        mounted() {
            const m = this;

        }


    }
</script>
<style scoped lang="less">
.f9-layout-comp {
    position: relative;

    > .bg {
        position: absolute;
        z-index: 1;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
    }

    > * {
        position: relative;
        z-index: 5;
    }

    > .bg div {
        position: absolute;
    }

    > .bg .l {
        left: 0;
    }

    > .bg .t {
        top: 0;
    }

    > .bg .r {
        right: 0;
    }

    > .bg .b {
        bottom: 0;
    }

    > .bg .c {
        background-repeat: repeat-x;
    }

    > .bg .m {
        background-repeat: repeat-y;
    }

    > .bg .c.m {
        background-repeat: repeat;
    }
}


</style>
