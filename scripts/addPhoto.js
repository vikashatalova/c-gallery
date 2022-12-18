const addPhoto = document.querySelector('#add-photo');
const addPostModal = document.querySelector('.add-post-modal'); 
const addPostModalStepOne = document.querySelector('.add-post-modal__step-1'); 
const addPostModalStepTwo = document.querySelector('.add-post-modal__step-2'); 
const modalFooter = document.querySelector('.modal__footer');

const bodyOverlay = document.querySelector('.body-overlay');
const postPublishButton = document.querySelector('#post-publish');
const fileUpload = document.querySelector('#file-upload');
let image = document.querySelector('#uploaded-photo');


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
            console.log('Ошибка');
        }
    });

};

uploadPhoto();


function showMessage () {
    const successMessage = document.querySelector('#alert-success');
    const clon = successMessage.content.firstElementChild.cloneNode(true);
    document.body.appendChild(clon);

    setTimeout(() => {
        clon.remove();
    }, 2000);
};

function errorMessage () {
    const errorMessage = document.querySelector('#alert-fail');
    const clon = errorMessage.content.firstElementChild.cloneNode(true);
    document.body.appendChild(clon);

    setTimeout(() => {
        clon.remove();
    }, 2000);
}


postPublishButton.addEventListener('click', () => {
    
    const postText = document.querySelector('#post-text');
    const postHashtags = document.querySelector('#post-hashtags');

    const formData = new FormData();
    formData.append("image", fileUpload.files[0]);
    formData.append("text", postText.value);
    formData.append("tags", postHashtags.value);


    const inputsAddPublish = document.querySelectorAll('textarea');

    for (let i = 0;  i < inputsAddPublish.length; i++) {
        inputsAddPublish[i].value = '';
    };

    const POST_URL = 'https://c-gallery.polinashneider.space/api/v1/posts/';
    const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc1NjgxNDg4LCJpYXQiOjE2NzA4NDMwODgsImp0aSI6ImQ4OTZlMGI3OGU5MDQ3NWRhZDRhZTI3MWUwYzdiY2FjIiwidXNlcl9pZCI6MjN9.KrsnNhRIOHdKTqm3Pr_eZUJRT4zwkfCTrdQFsVJa1Gg" ;

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

            showMessage();
        }
    })
    .catch((error) => {
        console.log(error);
        errorMessage();
    })
    return response 
});


