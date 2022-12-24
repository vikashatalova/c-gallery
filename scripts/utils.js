export const showMessage = (message) => {
    const showMessage = document.querySelector(message);
    const clon = showMessage.content.firstElementChild.cloneNode(true);
    document.body.appendChild(clon);

    const timer = setTimeout(() => {
        clon.remove();
    }, 2000);

    return timer
};

export const createElement = (anchor, text, hashtags, created_at) => {
    const postTempalete = document.querySelector('#post-template');
    const clonPost = postTempalete.content.firstElementChild.cloneNode(true);
    const imgElement = document.createElement('img');
    imgElement.src = anchor;
    const post = document.createElement('div');
    post.className = 'post';
    post.append(imgElement);
    post.append(clonPost);

    post.addEventListener('click', () => {
        const previewPostModal = document.querySelector('.preview-post-modal');
        const bodyOverlay = document.querySelector('.body-overlay');

        previewPostModal.classList.add('active');
        document.body.classList.add('with-overlay');
        bodyOverlay.classList.add('active');
        
        const postPhoto = document.querySelector('#post-photo');
        postPhoto.src = anchor;

        const postText = document.querySelector('.post-text');
        postText.textContent = text;
        
        const postHashtags = document.querySelector('.post-hashtags');
        const postHashtagsAnchor = document.createElement('a');
        postHashtagsAnchor.href = '#';
        postHashtagsAnchor.textContent = hashtags;
        postHashtags.append(postHashtagsAnchor);

        const accountInfoTime = document.querySelector('.account-info__time');
        const date = created_at;
        accountInfoTime.append(date);
        // при клике добавляется новая дата

        bodyOverlay.addEventListener('click', () => {
            previewPostModal.classList.remove('active');
            bodyOverlay.classList.remove('active');
            document.body.classList.remove('with-overlay');
        });
    })

    return post
};