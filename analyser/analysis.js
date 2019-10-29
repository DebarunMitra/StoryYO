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
    this.grammar=new Object();
    this.sentenceCount=0;
    this.words=new Object();
  }
  grammarAndSpellCheck(){
	let mainText=this.storyBody.replace(/<(?:.|\n)*?>/gm, '');
    let sen=mainText.split('.');
    let sl=sen.length;
    console.log(sen[3]);
    console.log('No of sentences:'+(sl-1));
    let grammar=Gramma.check('I have been work for 12 day.').then((value) => {
        return value.matches[0]
    });
    return grammar;
  }
  wordSentences(){
    
  }
  
}

module.exports = Article;
