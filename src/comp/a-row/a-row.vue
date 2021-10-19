<template lang="pug">
    .a-row-comp.row(
        :class="{between,around}"
    )
        slot(name="label")
            b(v-if="label||title") {{displayLabel}}
        .flex.fx1.content.ai-center: slot
        slot(name="end")
            b(v-if="end") {{end}}

</template>
<script>
import $ from "jquery"
import debounce from "lodash/debounce"
export default {
    name: "a-row",
    props: {
        "label":String,
        "title":String,
        "end":String,
        "between":Boolean,
        "around":Boolean,
        "autoWidth":Boolean,
        "blankLabel":Boolean,
        widthOffset:{
            type:Number,
            default:1,
        },

        //如果label和该字段相同,则不显示
        blankLabelSymbol:{
            type:String,
            default:"-",
        }
    },

    computed: {
      displayLabel() {
          const m = this;
          const {title, label} = m;
          let _label = title || label;
          if (m.blankLabelSymbol == _label) {
              return "";
          }
          return _label
      }
    },

    methods: {

        //手从触发重新布局
        resize() {
            const m = this;
            const $$parent = $(m.$el).parent();
            m.$nextTick(__=>{
                $$parent.trigger("a-row-resize");
            })
        }
    },

    mounted(){
        const m = this;
        const {widthOffset:offset} = m;
        const $$parent = $(m.$el).parent();
        const eventKey = ".ev-" + m._uid;
        let $el = $(m.$el);

        //计算宽度方法定义
        const calcWidth = debounce(__ => {
            $el.addClass("_anchor");
            if ($el.nextAll("._anchor").length) {
                return;
            }
            let $sibLs = $el.siblings(".a-row-comp").add(m.$el);
            let labels = $sibLs.find(">b").map((i, lb)=>lb.textContent.trim()).toArray();
            let maxLeng = Math.max.apply(
                null,
                labels.map(el => {
                    return el.replace(/[\u4e00-\u9fff]/g, "ss").length
                })
            )
            maxLeng = parseInt(maxLeng / 2);
            maxLeng = maxLeng + offset;
            $sibLs.find(">b").css({
                width: maxLeng + "em"
            });
        }, 120);

        m.$watch("autoWidth", {
            immediate:true,
            handler(autoWidth) {
                m.$el.parentElement.classList.add("a-row-content");
                if (autoWidth) {
                    setTimeout(calcWidth);
                    $$parent.on("a-row-resize" + eventKey, function () {
                        calcWidth();
                    });
                }else{
                    // $$parent.trigger("a-row-resize");
                    $$parent.off(eventKey);
                }
            }
        })
        m.__destroy.then(resp=>{
            $$parent.off(eventKey);
        })

    }
}
</script>
<style lang="less">

.row-content-rule(){
    >.row{
        padding: 0.5em 0;

        >b{
            white-space: nowrap;
            margin-right: 0.5em;
        }

        &:not(.db) {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        >*{
            margin-right: 0.5rem;
            &:last-child{
                margin-right: 0;
            }
        }
    }
}

.a-row-content{
    .row-content-rule;
    .a-row-comp{
        padding: 0;
        min-height: 30px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        &.between{
            .content{
                justify-content: space-between;
            }
        }
        &.around{
            .content{
                justify-content: space-around;
            }
        }

        &.lr{
            >b{
                text-align: right;
                margin-right: 0.5em;
            }
        }

        &.__narrow{
            .content{
                flex-grow: unset;
            }
        }
    }

    &.lr{
        >.a-row-comp{
            >b{
                text-align: right;
                margin-right: 0.5em;
            }
        }
    }

    .content{
        word-break: break-all;
    }
}
</style>
