import { showMessage, createElement } from "./utils.js";
import { POST_URL, AUTH_TOKEN, POSTS_URL } from "./variables.js";

const addPhoto = document.querySelector('#add-photo');
const addPostModal = document.querySelector('.add-post-modal'); 
const addPostModalStepOne = document.querySelector('.add-post-modal__step-1'); 
const addPostModalStepTwo = document.querySelector('.add-post-modal__step-2'); 
const modalFooter = document.querySelector('.modal__footer');
const bodyOverlay = document.querySelector('.body-overlay');
const postPublishButton = document.querySelector('#post-publish');
const fileUpload = document.querySelector('#file-upload');
const image = document.querySelector('#uploaded-photo');

addPhoto.addEventListener('click', () => {
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

        if (fileUpload) {
            console.log(fileUpload);
            addPostModalStepOne.classList.add('hidden');
            addPostModalStepTwo.classList.remove('hidden');
            addPostModalStepTwo.classList.add('active');
            modalFooter.classList.remove('hidden');
        } else {
            showMessage('#alert-fail')
        }
    });

};

uploadPhoto();

const postText = document.querySelector('#post-text');
const postHashtags = document.querySelector('#post-hashtags');

postPublishButton.addEventListener('click', () => {

    const formData = new FormData();
    formData.append("image", fileUpload.files[0]);
    formData.append("text", postText.value);
    formData.append("tags", postHashtags.value);


    const inputsAddPublish = document.querySelectorAll('textarea');

    for (let i = 0;  i < inputsAddPublish.length; i++) {
        inputsAddPublish[i].value = '';
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
        if (data) {
            photoCount.append(data.length);
            data.forEach((content) => {
                const photosContent = document.querySelector('.photos__content');
                const elementHTML = createElement(content.image, content.text, content.tags, content.created_at);
                photosContent.append(elementHTML);                  
            })
        } else {
            emptyContent.classList.remove('hidden'); 
        }
    })
    .catch(() => {
        showMessage('#alert-fail');
    });

    return response;
}

getPostUsers();


