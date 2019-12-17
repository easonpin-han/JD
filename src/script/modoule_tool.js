function $(selector,all){
    if(all!=='true'){
        return document.querySelector(selector);
    }else{
        return document.querySelectorAll(selector);
    }
}

export { $ }