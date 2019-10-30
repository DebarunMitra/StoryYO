/*
Author: Debarun Mitra
Technlogy: MongoDB, ExpressJS, NodeJS
Objective: Create an application where people can share their stories, ideas, thoughts and experiences.
*/
const Gramma = require("gramma");
const mongoose=require('mongoose');
const User=mongoose.model('users');
const Story=mongoose.model('stories');
class Article{
  constructor(storyId,storyBody,title,topic){
    this.storyId=storyId;
    this.storyBody=storyBody;
    this.title=title;
    this.topic=topic;
    this.noWords=['is','are','am','have','had','was','were','be','been','can','could','shall','should','will','would'];
    this.wordCount=0;
    this.grammar=new Array();
    this.count=0;
    this.sentenceCount=0;
    this.words=new Object();
  }
  grammerAndSpellCheck(){
    let mainText=this.storyBody.replace(/<(?:.|\n)*?>/gm, '');
    let sen=mainText.split('.');let result;
    let sentencesNo=sen.length;
    for(let i=0;i<sentencesNo-1;i++){
    Gramma.check(sen[i]).then((value)=>{
        if(value.matches[0]){
          this.collectMistakes(value.matches[0].message,value.matches[0].shortMessage,value.matches[0].word);
        }
       });
       if(i===(sentencesNo-2)){
          //return this.getError();
       }
     }
  }
  wordSentences(){
    let count=0,senWordCount=0,paragraphNo;
    let mainText=this.storyBody.replace(/<(?:.|\n)*?>/gm, '');
    let sen=mainText.split('.');
    let para=this.storyBody.split(/<(?:.)*?>/gm);
    paragraphNo=Math.floor(para.length/2);
    let sentencesNo=sen.length;
    for(let i=0;i<sentencesNo;i++){
      let wordCount=sen[i].split(' ');
      count+=wordCount.length;
      for(let j=0;j<wordCount.length;j++){
         let key= wordCount[j].replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        if(!this.words.hasOwnProperty(key)){
          this.words[key]=1;
        }
        else if(this.words.hasOwnProperty(key)){
          let keyValue=this.words[key];
          keyValue+=1;
          this.words[key]=keyValue;
        }
       }
    }
    this.wordCount=count-1;
    this.sentenceCount=sentencesNo-1;
    let point=this.point(this.sentenceCount,this.wordCount,paragraphNo);
    return ((sentencesNo-1)+':'+(count-1)+':'+paragraphNo+':'+point);
  }
  collectMistakes(description,issueType,word){
    console.log(description+','+issueType+','+word);
    this.grammar[this.count]={"description":description,"issueType":issueType,"word":word};
    this.count+=1;
  }
}

module.exports = Article;
