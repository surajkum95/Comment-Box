// import $ from 'jquery';
// let $ = require('jquery');
function getNode(identity){
    // return document.querySelector(identity);
    return $(identity);
}
export const textarea = getNode('#comment_text');
export const commentbtn = getNode('#comment_btn');
export const comments = getNode('#comments');