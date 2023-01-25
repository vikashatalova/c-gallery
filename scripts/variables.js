const URL = 'https://c-gallery.polinashneider.space/api/v1/'
const POST_URL = `${URL}posts/`;
const POSTS_URL = `${URL}users/me/posts/`;
const USERS_URL = `${URL}users/me/`;
const COMMENTS_URL = `${URL}comments/`;
const RANDOM_AVATAR = `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)}.svg`;
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc1NjgxNDg4LCJpYXQiOjE2NzA4NDMwODgsImp0aSI6ImQ4OTZlMGI3OGU5MDQ3NWRhZDRhZTI3MWUwYzdiY2FjIiwidXNlcl9pZCI6MjN9.KrsnNhRIOHdKTqm3Pr_eZUJRT4zwkfCTrdQFsVJa1Gg";

export {
    POST_URL,
    POSTS_URL,
    USERS_URL,
    COMMENTS_URL,
    RANDOM_AVATAR,
    AUTH_TOKEN
}