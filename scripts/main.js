import { showMessage, createElement } from "./utils.js";
import { POST_URL, AUTH_TOKEN, POSTS_URL, COMMENTS_URL } from "./variables.js";

const addPhoto = document.querySelector('#add-photo');
const addFirstPost = document.querySelector('#add-first-post');
const addPostModal = document.querySelector('.add-post-modal'); 
const addPostModalStepOne = document.querySelector('.add-post-modal__step-1'); 
const addPostModalStepTwo = document.querySelector('.add-post-modal__step-2'); 
const modalFooter = document.querySelector('.modal__footer');
const bodyOverlay = document.querySelector('.body-overlay');
const postPublishButton = document.querySelector('#post-publish');
const fileUpload = document.querySelector('#file-upload');
const image = document.querySelector('#uploaded-photo');
const photosContent = document.querySelector('.photos__content');
const previewPostModal = document.querySelector('.preview-post-modal');
const user = {  
    name: faker.name.firstName(), 
    surname: faker.name.lastName()
}

addPhoto.addEventListener('click', () => {
    addPostModal.classList.add('active');
    document.body.classList.add('with-overlay');
    bodyOverlay.classList.add('active');
});

addFirstPost.addEventListener('click', () => {
    addPostModal.classList.add('active');
    document.body.classList.add('with-overlay');
    bodyOverlay.classList.add('active');
});

bodyOverlay.addEventListener('click', () => {
    addPostModal.classList.remove('active');
    bodyOverlay.classList.remove('active');
    document.body.classList.remove('with-overlay');
});


const uploadPhoto = () => {

    fileUpload.addEventListener('change', () => {
        image.src = URL.createObjectURL(fileUpload.files[0]);
        image.style.display = "block";

        addPostModalStepOne.classList.add('hidden');
        addPostModalStepTwo.classList.remove('hidden');
        modalFooter.classList.remove('hidden');
    });
};

uploadPhoto();

const postText = document.querySelector('#post-text');
const postHashtags = document.querySelector('#post-hashtags');
const textCounter = document.querySelector('.text-counter');
const textValidate = document.querySelector('.text-validate');
const textValidateTags = document.querySelector('.text-validateTags');

postText.addEventListener('keydown', (e) => {
    const postTextValue = e.target.value;
    const pattern = /^([A-Za-z0-9_-]+)$/;
    const count = 2000;
    
    if (pattern.test(postTextValue) && postTextValue.length <= count) {
        textValidate.textContent = 'Данные введены корректно';
        const sumsCounter = Number(2000) - Number(postTextValue.length);
        textCounter.textContent = sumsCounter;
        postPublishButton.disabled = false;
    } else if (postTextValue.trim() === '') {
        textValidate.textContent = 'Поле обязательно для заполнения';
        postPublishButton.disabled = true;
    } else if (postTextValue.length === 2000) {
        const sumsCounter = Number(2000) - Number(postTextValue.length);
        textCounter.textContent = `Вы ввели слишком много символов, введите на ${sumsCounter} меньше`;
        postPublishButton.disabled = true;
    } else {
        textValidate.textContent = 'Данные введены неверно';
        postText.style.outlineColor = 'var(--error)';
        postPublishButton.disabled = true;
    }
})

postHashtags.addEventListener('keydown', (e) => {
    const hashtags = e.target.value;
    const pattern = /^#([A-Za-z0-9_-]+)$/;

    if (pattern.test(hashtags) && hashtags.length <= 200) {
        textValidateTags.textContent = 'Данные введены корректно';
        postPublishButton.disabled = false;
    } else if (hashtags.trim() === ' ') {
        textValidateTags.textContent = 'Поле обязательно для заполнения';
        postPublishButton.disabled = true;
    } else {
        textValidateTags.textContent = 'Данные введены неверно';
        postHashtags.style.outlineColor = 'var(--error)';
        postPublishButton.disabled = true;
    }
})


postPublishButton.addEventListener('click', () => {

    const formData = new FormData();
    formData.append("image", fileUpload.files[0]);
    formData.append("text", postText.value);
    formData.append("tags", postHashtags.value);


    const inputsAddPublish = document.querySelectorAll('textarea');

    for (let i = 0;  i < inputsAddPublish.length; i++) {
        fileUpload.value = "";
        postText.value = "";
        postHashtags.value = "";
        image.src = "";
    };

    const response = fetch(POST_URL, {
        method: 'POST',
        headers: {
            Authorization: AUTH_TOKEN
        },
        body: formData
    })
    .then((res) => {
        if (res.ok) {
            addPostModal.classList.remove('active');
            bodyOverlay.classList.remove('active');
            document.body.classList.remove('with-overlay');
            getPostUsers();

            showMessage('#alert-success');
        }
    })
    .catch(() => {
        showMessage('#alert-fail');
    })
    .finally(() => {
        addPostModalStepOne.classList.remove('hidden');
        addPostModalStepTwo.classList.add('hidden');
        modalFooter.classList.add('hidden');
    })
    return response 
});

const toggleLoader = () => {
    const loader = document.querySelector('#loader');
    const isHidden = loader.hasAttribute('hidden');
    if (isHidden) {
        loader.removeAttribute('hidden');
    } else {
        loader.setAttribute('hidden', '');
    }
}

// GET POST  USERS

const  getPostUsers = async () => {
    const emptyContent = document.querySelector('.empty-content');
    const photoCount = document.querySelector('#photo-count');
    toggleLoader();
    
    const response = await fetch(POSTS_URL, {
        method: 'GET',
        headers: {
            Authorization: AUTH_TOKEN
        }
    })
    .then((response) => {
        if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        photoCount.textContent = data.length;
        photosContent.innerHTML = '';
        data.forEach((content) => {
            const elementHTML = createElement(content);
            photosContent.append(elementHTML);

            const comments = content.comments;
            const dataId = content.id;
            const date = new Date(content.created_at);
            const options = {day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric'};
            const newDate = date.toLocaleDateString("ru", options);

            comments.forEach((comment) => {
                commentsContent.innerHTML = `
                <div class="comments__item">
                    <img
                        class="comments__item-avatar"
                        src="https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1).toString(36).substring(7)}.svg"
                        width="40"
                        alt=""
                    />
                    <div class="comments__item-text">
                        <h3 class="comments__item-nickname">${user.name}</h3>
                        <p class="comments__item-comment">
                            ${comment.text}
                        </p>
                        <span class="comments__item-time">${newDate}</span>
                    </div>
                </div>
                `
            })
            elementHTML.addEventListener('click', () => {
                deletePostUser(content);
            });
            countLikesPost(content);

            commentsButton.addEventListener('click', () => {
                const comment = postComment.value;
                if (comment.trim() === '') {
                    console.log('error');
                } else {
                    sendComment(comment, dataId, newDate);
                }
            });
            countCommentsPost(content);
        })

        if (data.length === 0) {
            emptyContent.classList.remove('hidden'); 
        }
    })
    .catch(() => {
        showMessage('#alert-fail');
    })
    .finally(() => {
        toggleLoader();
    })
    return response
}

getPostUsers();

// DELETE POST USER

const deletePost = document.querySelector('#delete-post');
const deletePostUser = (content) => {
    deletePost.addEventListener('click', () => {
        const { id } = content;

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

const likeButton = document.querySelector('.fa-heart');
const countElement = document.querySelector('#like');
const statisticsLikes = document.querySelector('.statistics__likes');
let likes = 0;

likeButton.addEventListener('click', () => {
    likes++;
    countElement.innerHTML = likes;
    statisticsLikes.classList.add('liked');
    getItemId();
});

const countLikesPost = (content) => {
    const { likes } = content;
    countElement.innerHTML = likes;
};

const updateCount = (itemId) => {
    countElement.innerHTML = likes;
  
    fetch(`${POST_URL}${itemId}/like/`, {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN
      },
      body: JSON.stringify({ likes }),
    });
};

const getItemId = () => {
    fetch(POSTS_URL, {
        method: 'GET',
        headers: {
            Authorization: AUTH_TOKEN
        }
    })
    .then((response) => response.json())
    .then((data) => {
        data.forEach((content) => {
            const dataId = content.id;
            updateCount(dataId);
        })
    })
};


// GET COMMENTS POST

const commentsContent = document.querySelector('.comments__content'); 
const commentsButton = document.querySelector('.comments-button');
const postComment = document.querySelector('#post-comment');


const countCommentsPost = (content) => {
    const comment = document.querySelector('#comment');
    const { comments } = content;
    comment.textContent = comments.length;
};

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
      } else {
        console.error('Error sending comment');
      }
    })
    .catch(error => {
      console.error(error);
    })
    return response
};

const filUploadAvatar = document.querySelector('#file-upload-avatar');
const imageAvatar = document.querySelector('#profile-avatar');

const getBioUser = () => {
    const response = fetch('https://c-gallery.polinashneider.space/api/v1/users/me/', {
        method: 'GET',
        headers: {
            Authorization: AUTH_TOKEN
        }
    })
    .then((res) => res.json())
    .then((data) => {
        imageAvatar.src = data.photo;
    })
    .catch(() => {
        showMessage('#alert-fail');
    })
    return response
}
getBioUser();

const createAvatarUser = () => {
    filUploadAvatar.addEventListener('change', () => {
        imageAvatar.src = URL.createObjectURL(filUploadAvatar.files[0]);
        imageAvatar.style.display = "block";

        const formData = new FormData();
        formData.append("photo", filUploadAvatar.files[0]);

        fetch('https://c-gallery.polinashneider.space/api/v1/users/me/', {
            method: 'PATCH',
            body: formData,
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
        .catch(() => {
            showMessage('#alert-fail');
        })
    });
}
createAvatarUser();












  

  







