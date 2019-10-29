/*
Author: Debarun Mitra
Technlogy: MongoDB, ExpressJS, NodeJS
Objective: Create an application where people can share their stories, ideas, thoughts and experiences.
*/
const moment=require('moment');
module.exports = {
  truncate: function(str, len){
    if (str.length > len && str.length > 0) {
			var new_str = str + " ";
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
    for(let prop in context)
    {
        ret = ret + options.fn({property:prop,value:context[prop]});
    }
    return ret;
  }
}
