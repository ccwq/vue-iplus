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
    rest.forEach(param=>{

        //数组
        if(Array.isArray(param)){
            if (params.length) {
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
                ret.redirect = param.substr(2);
                //别名
            } else if(param.startsWith("?")){
                ret.alias = param.substr(1);

                //名字
            } else{
                ret.name = param;
            }
        }
    })

    return ret;
};