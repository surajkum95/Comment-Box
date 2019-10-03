// import $ from 'jquery';
import '../css/styles.css';
import '../css/main.scss';
import '../comment-panel.html';
import {textarea, commentbtn, comments} from './app';
let uniqueId = 0;
let MessageArray = [];

function getDataFromLocalStorage(){
    return localStorage.getItem('comments') ? JSON.parse(localStorage.getItem('comments')) : [];
}

function saveInLocalStorage(comments){
    localStorage.setItem('comments', JSON.stringify(comments));
}

function createMessageTemplate(jsonMessage) {

    let template = `<div><span data-id=${jsonMessage.id}>${jsonMessage.message}</span><br/>
    <a href="#" data-id=${jsonMessage.id} data-like=${jsonMessage.liked}> ${jsonMessage.liked ? 'Liked' : 'Like'} </a>
    <a href="#" data-id=${jsonMessage.id} data-reply > Reply</a>
    <a href="#" data-id=${jsonMessage.id} data-delete > Delete</a><br/></div><br/>`;

    return template;
}

function appendElement(template){
    comments.innerHTML  += template;
}

function cleartTextArea(){
    textarea.value = "";
}

function clearComments(){
    comments.innerHTML = "";
}

function recursiveNestedCommentsCall(message){
    let template = createMessageTemplate(message);
    appendElement(template);
    if(message.nestedcomments.length !== 0){
        recursiveNestedCommentsCall(message.nestedcomments[0]);
    }
}

textarea.addEventListener('keyup', function(event){
    if(event.keyCode === 13 || event.target.id === "comment_btn"){
        if(textarea.value !== "\n"){
            let comment_id = 'comment_' + ++uniqueId;
            let liked = false;
            let jsonMessage = {
                "id": comment_id,
                "message": textarea.value,
                "liked": liked,
                "uniqueIdCount": uniqueId,
                "nestedcomments": []
            }; 
            let template = createMessageTemplate(jsonMessage);
            MessageArray.push(jsonMessage);
            appendElement(template);
            saveInLocalStorage(MessageArray);
            cleartTextArea();
        }
    }
    else{
        event.preventDefault();
    }
});

// function comment(event){
    
// };

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoadedEvent triggered');
    let templates = getDataFromLocalStorage();
    uniqueId = templates.length !== 0 ? templates.reduce((curr, prev) => {
        return curr.uniqueIdCount > prev.uniqueIdCount ? curr.uniqueIdCount : prev.uniqueIdCount;
    }) : 0;
    templates.forEach((message) => {
        let template = recursiveNestedCommentsCall(message);
         MessageArray.push(message);
        // appendElement(template);
    });
});

document.addEventListener('load', (event) => {
    console.log('load event triggered');
})

document.addEventListener('close', (event) => {
    console.log('close');
})

comments.addEventListener('click', (event) => {
    let e = event.target;
    // e.dataset.like = e.dataset.like === "false" ? false : true;
    if(e.getAttribute('data-like') !== null && e.getAttribute('data-like') !== undefined){
        let mathchedIDJSON = MessageArray.find((value) => value.id === e.dataset.id);
        mathchedIDJSON.liked = !mathchedIDJSON.liked;
        e.innerHTML = mathchedIDJSON.liked ? "Liked" : "Like";
        saveInLocalStorage(MessageArray);
    }
    else if(e.dataset.reply !== null && e.dataset.reply !== undefined){
        // console.log(event.target.parentNode);
        if(e.dataset.reply === 'active'){
            return;
        }
        let replyNode = document.createElement('input');
        // replyNode.dataset.replyInput = "";
        replyNode.addEventListener('keyup', (event) => {
            if(event.keyCode === 13){
                // console.log(event.target.value);
                e.dataset.reply = 'inactive';
                let commentToBeRepliedFromComments = MessageArray.find((value) => value.id === e.dataset.id);
                commentToBeRepliedFromComments.nestedcomments.push({
                "id": 'comment_' + ++uniqueId,
                "message": event.target.value,
                "liked": false,
                "uniqueIdCount": uniqueId,
                "nestedcomments": []
                });
                saveInLocalStorage(MessageArray);
                //event.target.parentNode.removeChild(replyNode);
                let inputReplyNode = event.target.parentElement.getElementsByTagName('input');
                inputReplyNode[0].style.display = 'none';
            }
        });
        event.target.parentNode.appendChild(replyNode);
        e.dataset.reply = 'active';
    }
    else if(e.dataset.delete !== null && e.dataset.delete !== undefined){
        let clickedID = e.dataset.id;
        MessageArray = MessageArray.filter((value) => {
            return value.id !== clickedID;
        });
        saveInLocalStorage(MessageArray);
        clearComments();
        MessageArray.forEach((message) => {
            let template = createMessageTemplate(message);
            appendElement(template);
        });
    }
    // else if(e.dataset.replyInput !== null && e.dataset.replyInput !== undefined){
    //     // if(event.keyCode === 13){
    //     //     console.log("haha");
    //     //     console.log(event.target);
    //     // }
    // }
    else {
        event.preventDefault();
    }
});