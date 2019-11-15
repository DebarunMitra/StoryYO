const moment=require('moment');

module.exports = {
  /**
   * [truncate description]
   * @param  {[string]} str [article string]
   * @param  {[number]} len [length of the article]
   * @return {[string]}     [send some part of article]
   */
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
  /**
   * [stripTags]
   * @param  {[string]} input [article string]
   * @return {[string]}       [remove html tag from article]
   */
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  /**
   * [formatDate]
   * @param  {[date]} date   [date of the article]
   * @param  {[date format]} format [format of the date]
   * @return {[date wiht format]}        [date format to display into the title]
   */
  formatDate: function(date, format){
      return moment(date).format(format);
  },
  /**
   * [select(used in edit page)]
   * @param  {[string]} selected [takes the article status(public/private) etc]
   * @param  {[string]} options  [checks the option selected]
   * @return {[string]}          [return selected option]
   */
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  /**
   * [senNo]
   * @param  {[string]} sen [takes an data sring with sentence no, word no, paragraph no and point]
   * @return {[type]}     [number of sentence]
   */
  senNo:function(sen){
    let sc=sen.split(':');
    return sc[0];
  },
  /**
   * [description]
   * @param  {[type]} word [takes an data sring with sentence no, word no, paragraph no]
   * @return {[type]}      [number of words]
   */
  wordNo:function(word){
    let wc=word.split(':');
    return wc[1];
  },
  /**
   * [paragraphNo]
   * @param  {[type]} para [takes an data sring with sentence no, word no, paragraph no]
   * @return {[type]}      [number of paragraphs]
   */
  paragraphNo:function(para){
    let pc=para.split(':');
    return pc[2];
  },
  /**
   * [description]
   * @param  {[type]} value   [description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
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
  /**
   * [readingTime]
   * @param  {[]} data [description]
   * @return {[type]}      [description]
   */
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
  /**
   * [description]
   * @return {[string]} [image file path]
   */
bgimage:function(){
  return 'css/content.png';
  },
  /**
   * [rank]
   * @param  {[array object]} stories [all stories of user]
   * @return {[number]}         [count all the points of article]
   */
rank:function(stories){
  let totalPoint=0,res=0;
  stories.forEach((value,key)=>{
    totalPoint+=value.point;res++;
  });
  res=totalPoint/res;
  return res.toFixed(2);
},
/**
 * [editIcon]
 * @param  {[string]}  storyUser       [story user id]
 * @param  {[string]}  loggedUser      [logged user id]
 * @param  {[string]}  storyId         [story id]
 * @param  {Boolean} [floating=true] [icon status]
 * @return {[html tag]}              [show edit icon only for user story]
 */
editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}
