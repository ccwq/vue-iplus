import get from "lodash/get";

export default {
    name:"x-define",

    data() {
        const m = this;
        return {
            initData: m.defaultInitData,

            ...m.data,
        }
    },

    props:{

        defaultInitData: {default:""},

        init:{
            type:[Function, String, Promise],
            default:""
        },

        //默认data的配置
        data:{
            type:Object,
            default:_=>{
                return {};
            },
        },
    },

    computed:{
        exposeData(){
            const m = this;
            return {
                _uid:m._uid,
                initData:m.initData,
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
            let _field = fieldArr.splice(-1);
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

    mounted(){
        const m = this;
        let init = m.init;
        function initComplete(resp){
            m.initData = resp || m.defaultInitData;
        }
        if (init) {
            let resp;
            if (init.then) {
                init.then(initComplete)
                return;
            }
            resp = init(m);
            if (!resp) {
                console.warn('init无回复值');
            }
            if (resp.then) {
                resp.then(initComplete)
            }else{
                initComplete(resp);
            }
        }else{
            console.warn('init无回复值');
        }
    },
}
