import { showMessage, createElement } from "./utils.js";
import { POST_URL, AUTH_TOKEN, POSTS_URL, USERS_URL } from "./variables.js";
import { messageFail, messageSuccess } from "./utils.js";

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
        const sumsCounter = count - Number(postTextValue.length);
        textCounter.textContent = sumsCounter;
        postPublishButton.disabled = false;
    } else if (postTextValue === '') {
        textValidate.textContent = 'Поле обязательно для заполнения';
        postPublishButton.disabled = true;
    } else if (postTextValue.length === 2000) {
        const sumsCounter = count - Number(postTextValue.length);
        textCounter.textContent = `Вы ввели слишком много символов, введите на ${sumsCounter} меньше`;
        postPublishButton.disabled = true;
    } else {
        textValidate.textContent = 'Данные введены неверно';
        postText.classList.add('error-validate');
        postPublishButton.disabled = true;
    }
})

postHashtags.addEventListener('keydown', (e) => {
    const hashtags = e.target.value;
    const pattern = /^#([A-Za-z0-9_-]+)$/;

    if (pattern.test(hashtags) && hashtags.length <= 200) {
        textValidateTags.textContent = 'Данные введены корректно';
        postPublishButton.disabled = false;
    } else if (hashtags === '') {
        textValidateTags.textContent = 'Поле обязательно для заполнения';
        postPublishButton.disabled = true;
    } else {
        textValidateTags.textContent = 'Данные введены неверно';
        postHashtags.classList.add('error-validate');
        postPublishButton.disabled = true;
    }
})


postPublishButton.addEventListener('click', () => {
    const formData = new FormData();
    formData.append("image", fileUpload.files[0]);
    formData.append("text", postText.value);
    formData.append("tags", postHashtags.value);

    fileUpload.value = "";
    postText.value = "";
    postHashtags.value = "";
    image.src = "";

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

            showMessage(messageSuccess, 'Данные сохранились', 'Ваши данные сохранены');
        }
    })
    .catch(() => showMessage(messageFail, 'Ошибка', 'Не удалось отправить данные'))
    .finally(() => {
        addPostModalStepOne.classList.remove('hidden');
        addPostModalStepTwo.classList.add('hidden');
        modalFooter.classList.add('hidden');
    })
    return response 
});

const toggleLoader = () => {
    const loader = document.querySelector('#loader'); 
    loader.classList.remove('hidden');
    loader.classList.add('hidden');
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
        })

        if (data.length === 0) {
            emptyContent.classList.remove('hidden'); 
        }
    })
    .catch(() => showMessage(messageFail, 'Ошибка', 'Повторите попытку снова'))
    .finally(() => toggleLoader())
    return response
}
getPostUsers();

const filUploadAvatar = document.querySelector('#file-upload-avatar');
const imageAvatar = document.querySelector('#profile-avatar');

const getBioUser = () => {
    const response = fetch(`${USERS_URL}`, {
        method: 'GET',
        headers: {
            Authorization: AUTH_TOKEN
        }
    })
    .then((res) => res.json())
    .then((data) => {
        imageAvatar.src = data.photo;
    })
    .catch(() => showMessage(messageFail, 'Ошибка', 'Повторите попытку снова'))
    return response
}
getBioUser();

const createAvatarUser = () => {
    filUploadAvatar.addEventListener('change', () => {
        imageAvatar.src = URL.createObjectURL(filUploadAvatar.files[0]);
        imageAvatar.style.display = "block";

        const formData = new FormData();
        formData.append("photo", filUploadAvatar.files[0]);

        fetch(`${USERS_URL}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                Authorization: AUTH_TOKEN
            }
        })
        .then((res) => {
            if (res.ok) {
                showMessage(messageSuccess, 'Обновлено', 'Ваши данные обновились');
            } else {
                showMessage(messageSuccess, 'Ошибка', 'Ваши данные не обновились');
            }
        })
        .catch(() => showMessage(messageSuccess, 'Ошибка', 'Ваши данные не обновились'))
    });
}
createAvatarUser();












  

  







