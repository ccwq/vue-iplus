export default {
    name:"vue-iconfont",
    props:{
        icon:{
            default:"",
            type:String
        },
    },
    render(h){
        const m = this;
        const {icon} = m;

        //jsx无法支持属性名带xlink:href 此处改写为xlinkHref
        return <svg class="svg-icon" aria-hidden="true">
            <use xlinkHref ={`#${icon}`}/>
        </svg>
    }
}


