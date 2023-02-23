const UrlParam = {
    /* 自定义trim */
    trim (str) {  //删除左右两端的空格,自定义的trim()方法
        return str === undefined ? "" : str.replace(/(^\s*)|(\s*$)/g, "")
    },
    //获取url地址上面的参数
    requestUrlParam(argname){
        var url = location.href
        var arrStr = url.substring(url.indexOf("?")+1).split("&")
        for(var i =0;i<arrStr.length;i++)
        {
            var loc = arrStr[i].indexOf(argname+"=")
            if(loc!==-1){
                return arrStr[i].replace(argname+"=","").replace("?","")
            }
        }
        return ""
    }
}

export default UrlParam

