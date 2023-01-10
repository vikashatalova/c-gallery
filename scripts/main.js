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

postText.addEventListener('keydown', (e) => {
    const textLength = e.target.value.length;

    if(textLength < 2000) {
        var sum = Number(2000) - Number(textLength);
    } else if(textLength === 2000) {
        var sum = 'Данные введены корректно';
        postPublishButton.disabled = false;
    } else {
        var sums = Number(textLength) - 2000, 
        sum = 'Вы вели слишком много символов введите на '+sums+'  меньше';
        postText.style.outlineColor = 'var(--error)'
        postPublishButton.disabled = true;
    }
    textCounter.textContent = sum;
    textCounter.style.color = 'var(--error)';
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

// GET POST  USERS

const getPostUsers = () => {
    const emptyContent = document.querySelector('.empty-content');
    const photoCount = document.querySelector('#photo-count');
    
    const response = fetch(POSTS_URL, {
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
        photoCount.append(data.length);
        data.map((content) => {  
            const elementHTML = createElement(content);
            photosContent.append(elementHTML);
        })

        if (data.length === 0) {
            emptyContent.classList.remove('hidden'); 
        }
    })
    .catch(() => {
        showMessage('#alert-fail');
    })

    return response
}

getPostUsers();









  

  







