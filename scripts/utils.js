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
  const {image, text, tags, created_at} = content;

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

    const previewPostModal = document.querySelector('.preview-post-modal');
    const bodyOverlay = document.querySelector('.body-overlay');

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

    bodyOverlay.addEventListener('click', () => {
      previewPostModal.classList.remove('active');
      bodyOverlay.classList.remove('active');
      document.body.classList.remove('with-overlay');
    });
  })
  return post
};