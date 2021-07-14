import isPlainObject from "lodash/isPlainObject"

/**
 * 定义路由项
 * @param path
 * @param component
 * @param
 * "foo" name
 * "=>foo/bar" 为redirece
 * [...]  为子路由
 * {render, template} 包含两个属性之一为component
 * {} 为其他配置
 */
export const defineRouter = function (path, ...rest) {
    let ret = {path};
    const {
        _isf7
    } = this || {};
    rest.forEach(param=>{
        //数组
        if(Array.isArray(param)){
            if (param.length) {
                ret.children = param;
            }
            //对象
        }else if (isPlainObject(param)) {

            //是否是组件
            if (param.render || param.template) {
                ret.component = param;
            }else{
                ret = Object.assign({}, param, ret);
            }

            //字符串
        }else if (typeof param == "string") {

            //重定向
            if (param.startsWith("#")) {
                ret.redirect = param.substr(1);
                //别名
            } else if(param.startsWith("?")){
                ret.alias = param.substr(1);
                //名字
            } else{
                ret.name = param;
            }

            //异步组件
        }else if (typeof param == "function") {
            if (!_isf7) {
                ret.component = param;
            }else{
                ret.async = function(to, form, resolve, reject){
                    param().then(resp => resolve({component:resp.default})).catch(reject);
                }
            }
        }
    })
    return ret;
};


/**
 * 针对f7的适配
 * @returns {any}
 */
export const defineRouterF7 = function(...rest){
    return defineRouter.apply({_isf7: true}, rest);
}