import { POST_URL, AUTH_TOKEN, COMMENTS_URL } from "./variables.js";

const deletePost = document.querySelector('#delete-post');
const previewPostModal = document.querySelector('.preview-post-modal');
const bodyOverlay = document.querySelector('.body-overlay');
const staticsLikesSpan = document.querySelector('#like');
const btnLike = document.querySelector('.fa-heart');

export const showMessage = (message) => {
  const showMessage = document.querySelector(message);
  const clon = showMessage.content.firstElementChild.cloneNode(true);
  document.body.appendChild(clon);

  const timer = setTimeout(() => {
    clon.remove();
  }, 2000);
  return timer
};

export const createElement = (content) => {
  const {image, text, tags, created_at, likes, comments, id} = content;
  const staticsLikesSpan = document.querySelector('#like');
  const user = {  
    name: faker.name.firstName()
  }
 
  const postTempalete = document.querySelector('#post-template');
  const clonPost = postTempalete.content.firstElementChild.cloneNode(true);
  const imgElement = document.createElement('img');
  imgElement.src = image;
  const post = document.createElement('div');
  post.className = 'post';
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

    staticsComment.textContent = comments.length;
    staticsComment.dataset.postId = id;
    
    deletePostUser(id);

    btnLike.addEventListener('click', () => handleClick(id));

    commentsButton.addEventListener('click', () => {
      const comment = postComment.value;
      if (comment === '') {
        showMessage('#alert-fail');
      } else {
        sendComment(comment, id);
      }
    });

    const commentsContent = document.querySelector('.comments__content');
    commentsContent.dataset.postId = id;
    
    comments.forEach((comment) => {
      const dateCommnets = new Date(comment.created_at);
      const optionsComments = {day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'};
      const newDateComments = dateCommnets.toLocaleDateString("ru", optionsComments);

      const commentsItem = document.createElement('div');
      commentsItem.className = 'comments__item';
      commentsItem.dataset.postId = id;

      const commentsAvatar = document.createElement('img');
      commentsAvatar.className = 'comments__item-avatar';
      commentsAvatar.src = `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)}.svg`;
      commentsAvatar.width = 40;      

      const commentsText = document.createElement('div');
      commentsText.className = 'comments__item-text';

      const commentNickname = document.createElement('h3');
      commentNickname.className = 'comments__item-nickname';
      commentNickname.innerHTML = user.name;

      const newComment = document.createElement('p');
      newComment.className = 'comments__item-comment';
      newComment.innerText = comment.text;
      
      const commentTime = document.createElement('span');
      commentTime.className = 'comments__item-time';
      commentTime.innerText = newDateComments;

      commentsText.append(commentNickname);
      commentsText.append(newComment);
      commentsText.append(commentTime);

      commentsItem.append(commentsAvatar);
      commentsItem.append(commentsText);

      commentsContent.innerHTML = "";
      commentsContent.append(commentsItem);
    });

    bodyOverlay.addEventListener('click', () => {
      previewPostModal.classList.remove('active');
      bodyOverlay.classList.remove('active');
      document.body.classList.remove('with-overlay');
    });
  })
  return post
};

// DELETE POST USER

const deletePostUser = (id) => {
  deletePost.addEventListener('click', () => {
    const response = fetch(`${POST_URL}${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: AUTH_TOKEN
      }
    })
    .then((data) => {
      if (data.ok) {
        showMessage('#alert-success');
      }
    })
    .catch(() => {
      showMessage('#alert-fail');
    })
    .finally(() => {
      previewPostModal.classList.remove('active');
      bodyOverlay.classList.remove('active');
      document.body.classList.remove('with-overlay');
    })
    return response
  })
}

// LIKE POST USER

function handleClick(postId) {
  if (staticsLikesSpan.classList.contains('liked')) {
    return
  }

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
      showMessage('#alert-success');
    } else {
      showMessage('#alert-fail');
    }
  })
  .catch(() => showMessage('#alert-fail'))
}

// SEND COMMENT USER

const staticsComment = document.querySelector('#comment');
const commentsButton = document.querySelector('.comments-button');
const postComment = document.querySelector('#post-comment');

const sendComment = (comment, id) => {
  const data = {
    text: comment,
    post: id
  }
  const response = fetch(COMMENTS_URL, {
    method: 'POST',
    headers: {
      Authorization: AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      postComment.value = '';
      showMessage('#alert-success');
    } else {
      showMessage('#alert-fail');
    }
  })
  .catch(() => {
    showMessage('#alert-fail');
  })
  return response
};


