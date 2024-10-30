import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  feather.replace();

  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const postForm = document.getElementById('postForm');
  const submitPost = document.getElementById('submitPost');
  const postsContainer = document.getElementById('posts');
  const loadingSpinner = document.getElementById('loadingSpinner');

  newPostBtn.addEventListener('click', () => {
    postForm.classList.toggle('hidden');
  });

  submitPost.addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const body = quill.root.innerHTML;
    const author = document.getElementById('postAuthor').value;

    if (title && body && author) {
      showLoading();
      try {
        await backend.addPost(title, body, author);
        document.getElementById('postTitle').value = '';
        quill.setContents([]);
        document.getElementById('postAuthor').value = '';
        postForm.classList.add('hidden');
        await fetchAndDisplayPosts();
      } catch (error) {
        console.error('Error submitting post:', error);
      } finally {
        hideLoading();
      }
    }
  });

  async function fetchAndDisplayPosts() {
    showLoading();
    try {
      const posts = await backend.getPosts();
      postsContainer.innerHTML = '';
      posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <div class="post-content">${post.body}</div>
          <p class="post-meta">By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
        `;
        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      hideLoading();
    }
  }

  function showLoading() {
    loadingSpinner.classList.remove('hidden');
  }

  function hideLoading() {
    loadingSpinner.classList.add('hidden');
  }

  await fetchAndDisplayPosts();
});
