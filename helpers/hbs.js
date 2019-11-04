const moment=require('moment');
module.exports = {
  truncate: function(str, len){
    if (str.length > len && str.length > 0) {
			let new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate:function(date,format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  senNo:function(sen){
    let sc=sen.split(':');
    return sc[0];
  },
  wordNo:function(word){
    let wc=word.split(':');
    return wc[1];
  },
  paragraphNo:function(para){
    let pc=para.split(':');
    return pc[2];
  },
  eachProperty: function(value,options) {
    let context=JSON.parse(value);
    var ret = "";
    //console.log(typeof(context));
    //console.log(Object.keys(context).length);
    for(let prop in context)
    {
        ret = ret + options.fn({property:prop,value:context[prop]});
    }
    return ret;
  },
  readingTime:function(data){
    let words=data.split(':');
    let time=(words[1]/200)*60;
    return time.toFixed(2);
  },
  speakingTime:function(data){
    let words=data.split(':');
    let time=(words[1]/130)*60;
    return time.toFixed(2);
  },
  articlePoint:function(data){
    let point=data.split(':');
    return point[3];
  },
  promiseHandle:function(promise){
    // var promiseValue;
    // promise.then((value) => {
    //   promiseValue=value;
    //   console.log(value);
    // });
    // console.log(promiseValue);
    // return promiseValue;
  }
}
