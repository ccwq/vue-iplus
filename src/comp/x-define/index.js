import get from "lodash/get";
export default {
    name:"x-define",
    data() {
        const m = this;
        return {
            ...m.data,
        }
    },

    props:{

        //默认data的配置
        data:{
            type:Object,
            default:{},
        },
    },

    computed:{
        exposeData(){
            const m = this;
            return {
                _set:m.set,
                ...m.$attrs,
                ...Object.keys(m.data).reduce((result, key)=>{
                    result[key] = m[key];
                    return result;
                }, {}),
            }
        },
    },

    render(h){
        let {tag} = this.$attrs;
        if (tag) {
            return h(tag, {className:"define-x-tag"}, [this.$scopedSlots.default(this.exposeData)]);
        }else{
            return this.$scopedSlots.default(this.exposeData);
        }
    },

    methods: {

        //修改属性
        set(field, value) {
            const m = this;
            let fieldArr;
            if (Array.isArray(field)) {
                fieldArr = field;
            }else{
                fieldArr = field.split(/(\/|\.|\|)/);
            }
            let _field = fieldArr.split(-1);

            if (!fieldArr.length) {
                m[_field] = value;
            }else{
                let obj = get(m, _field);
                if (obj) {
                    m.$set(obj, value);
                }else{
                    throw new Error("修改属性失败");
                }
            }
        }
    },
}


