import { getPostUsers } from "./main.js";
import { POST_URL, AUTH_TOKEN, COMMENTS_URL, RANDOM_AVATAR, USERS_URL, POSTS_URL } from "./variables.js";

const deletePost = document.querySelector('#delete-post');
const previewPostModal = document.querySelector('.preview-post-modal');
const bodyOverlay = document.querySelector('.body-overlay');
const statickLike = document.querySelector('.statistics__likes');
const staticsLikesSpan = document.querySelector('#like');
const btnLike = document.querySelector('.fa-heart');
const messageFail = document.querySelector('#alert-fail');
const messageSuccess = document.querySelector('#alert-success');
const commentsContent = document.querySelector('.comments__content');
const user = {  
  name: faker.name.firstName()
}
export {
  messageFail,
  messageSuccess
}

export const showMessage = (type, header, message) => {
  const COUNT = 2000;
  const messageFail = type;

  const headerMessage = messageFail.content.querySelector('h4');
  headerMessage.textContent = header;

  const textMessage = messageFail.content.querySelector('p');
  textMessage.textContent = message;

  const clonMessage = messageFail.content.firstElementChild.cloneNode(true);
  document.body.append(clonMessage);

  setTimeout(() => {
    clonMessage.remove();
  }, COUNT);
}

const closePreviewPostModal = () => {
  previewPostModal.classList.remove('active');
  bodyOverlay.classList.remove('active');
  document.body.classList.remove('with-overlay');

  commentsContent.innerHTML = "";
}

export const createElement = (content) => {
  const {image, text, tags, created_at, likes, comments, id} = content;
 
  const postTempalete = document.querySelector('#post-template');
  const overlayLikes = postTempalete.content.querySelector('.likes span');
  overlayLikes.textContent = likes;
  const overlayComments = postTempalete.content.querySelector('.comments span');
  overlayComments.textContent = comments.length;
  const clonPost = postTempalete.content.firstElementChild.cloneNode(true);

  const imgElement = document.createElement('img');
  imgElement.src = image;
  const post = document.createElement('div');

  post.classList = 'post';
  post.append(imgElement);
  post.append(clonPost);

  post.addEventListener('click', (e) => {
    e.preventDefault();

    previewPostModal.classList.add('active');
    document.body.classList.add('with-overlay');
    bodyOverlay.classList.add('active');
        
    const postPhoto = document.querySelector('#post-photo');
    postPhoto.src = image;

    const postText = document.querySelector('.post-text');
    postText.textContent = text;
        
    const postHashtags = document.querySelector('.post-hashtags');
    postHashtags.textContent = tags;

    const accountInfoTime = document.querySelector('.account-info__time');
    const date = new Date(created_at);
    const options = {day: 'numeric', month: 'long'};
    const newDate = date.toLocaleDateString("ru", options);
    accountInfoTime.textContent = newDate;

    staticsLikesSpan.textContent = likes;
    staticsLikesSpan.dataset.postId = id;

    if (staticsLikesSpan.textContent > 0) {
      statickLike.classList.add('liked')
    } else {
      statickLike.classList.remove('liked')
    }

    staticsComment.textContent = comments.length;
    staticsComment.dataset.postId = id;
    
    deletePostUser(id);

    btnLike.addEventListener('click', () => handleClick(id));

    commentsButton.addEventListener('click', () => {
      const comment = postComment.value;
      if (comment === '') {
        commentsButton.disabled = true;
      } else {
        commentsButton.disabled = false;
        sendComment(comment, id);
      }
    });

    commentsContent.dataset.postId = id;
    
    comments.forEach((comment) => {
      const dateComments = getNewDate(comment.created_at);
      createNewComment(id, RANDOM_AVATAR, user.name, comment.text, dateComments);
    });

    bodyOverlay.addEventListener('click', () => closePreviewPostModal());
  })
  return post
};

// DELETE POST USER

const deletePostUser = (id) => {
  deletePost.addEventListener('click', () => {
    fetch(`${POST_URL}${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: AUTH_TOKEN
      }
    })
    .then((data) => {
      if (data.ok) {
        showMessage(messageSuccess, 'Удалено', 'Данные успешно удалены');
        getPostUsers(id);
      }
    })
    .catch(() => {
      showMessage(messageFail, 'Ошибка', 'Повторите попытку снова');
    })
    .finally(() => {
      closePreviewPostModal();
    })
  })
}

// LIKE POST USER

function handleClick(postId) {
  if (staticsLikesSpan.classList.contains('liked')) {
    return 
  } 
  console.log(staticsLikesSpan.classList.contains('liked'));
  staticsLikesSpan.textContent = Number(staticsLikesSpan.textContent) + 1;
  staticsLikesSpan.dataset.postId = postId;
  staticsLikesSpan.classList.add('liked');

  sendDataToServer(staticsLikesSpan.textContent, postId);
}


function sendDataToServer(likes, postId) {
  fetch(`${POST_URL}${postId}/like/`, {
    method: 'POST',
    body: JSON.stringify(likes),
    headers: { 
      Authorization: AUTH_TOKEN
    }
  })
  .then((res) => {
    if (res.ok) {
      showMessage(messageSuccess, 'Успешно', 'Данные отправлены');
    } else {
      showMessage(messageFail, 'Ошибка', 'Повторите попытку снова');
    }

    return res.json()
  })
  .then((data) => {
    console.log(data);
  })
  .catch(() => showMessage(messageFail, 'Ошибка', 'Повторите попытку снова'))
}

// SEND COMMENT USER

const staticsComment = document.querySelector('#comment');
const commentsButton = document.querySelector('.comments-button');
const postComment = document.querySelector('#post-comment');

const sendComment = (comment, id) => {
  console.log(comment.length);
  console.log(id);
  const data = {
    text: comment,
    post: id
  }
  fetch(COMMENTS_URL, {
    method: 'POST',
    headers: {
      Authorization: AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.status === 201) {
      showMessage(messageSuccess, 'Успешно', 'Комментарий добавлен');
    } else {
      showMessage(messageFail, 'Ошибка', 'Повторите попытку снова');
    }
    return response.json();
  })
  .then((data) => {
    const dateComments = getNewDate(data.created_at);
    createNewComment(data.post, RANDOM_AVATAR, user.name, data.text, dateComments);
    postComment.value = '';
  })
  .catch(() => showMessage(messageFail, 'Ошибка', 'Повторите попытку снова'))
};

const createNewComment = (id, avatar, userName, commentText, date) => {
  const commentsItem = document.createElement('div');
  commentsItem.classList = 'comments__item';
  commentsItem.dataset.postId = id;

  const commentsAvatar = document.createElement('img');
  commentsAvatar.classList = 'comments__item-avatar';
  commentsAvatar.src = avatar;
  commentsAvatar.width = 40;      

  const commentsText = document.createElement('div');
  commentsText.classList = 'comments__item-text';

  const commentNickname = document.createElement('h3');
  commentNickname.classList = 'comments__item-nickname';
  commentNickname.textContent = userName;

  const newComment = document.createElement('p');
  newComment.classList = 'comments__item-comment';
  newComment.textContent = commentText;
      
  const commentTime = document.createElement('span');
  commentTime.classList = 'comments__item-time';
  commentTime.textContent = date;

  commentsText.append(commentNickname);
  commentsText.append(newComment);
  commentsText.append(commentTime);

  commentsItem.append(commentsAvatar);
  commentsItem.append(commentsText);

  commentsContent.append(commentsItem);
}

const getNewDate = (date) => {
  const dateCommnents = new Date(date);
  const optionsComments = {day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'};
  const newDateComments = dateCommnents.toLocaleDateString("ru", optionsComments);

  return newDateComments
}





