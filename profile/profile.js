// Global state variables
let profileData = {
    username: '',
    email: '',
    bio: '',
    preferences: {
      darkMode: false,
      notifications: true,
      newsletter: false
    }
  };
  
  let isEditing = false;
  let isSaving = false;
  let message = { text: '', type: '' };
  let avatarPreview = '/default-avatar.png';
  
  // Update form fields with current profileData values
  function updateForm() {
    document.getElementById('username').value = profileData.username;
    document.getElementById('email').value = profileData.email;
    document.getElementById('bio').value = profileData.bio;
    document.getElementById('darkMode').checked = profileData.preferences.darkMode;
    document.getElementById('notifications').checked = profileData.preferences.notifications;
    document.getElementById('newsletter').checked = profileData.preferences.newsletter;
    document.getElementById('avatar-image').src = avatarPreview;
  }
  
  // Toggle editing mode: enable/disable form fields and update button group
  function toggleEditing(editing) {
    isEditing = editing;
    document.getElementById('username').disabled = !isEditing;
    document.getElementById('email').disabled = !isEditing;
    document.getElementById('bio').disabled = !isEditing;
    document.getElementById('darkMode').disabled = !isEditing;
    document.getElementById('notifications').disabled = !isEditing;
    document.getElementById('newsletter').disabled = !isEditing;
  
    // Show/hide avatar upload section
    document.getElementById('avatar-upload').style.display = isEditing ? 'block' : 'none';
  
    // Update the button group
    const buttonGroup = document.getElementById('button-group');
    buttonGroup.innerHTML = ''; // clear current buttons
  
    if (!isEditing) {
      // When not editing, show the Edit button
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.id = 'edit-button';
      editBtn.className = 'edit-button';
      editBtn.textContent = 'Edit Profile';
      editBtn.addEventListener('click', () => toggleEditing(true));
      buttonGroup.appendChild(editBtn);
    } else {
      // In editing mode, show Save and Cancel buttons
      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.className = 'save-button';
      saveBtn.disabled = isSaving;
      saveBtn.textContent = isSaving ? 'Saving...' : 'Save Changes';
  
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'cancel-button';
      cancelBtn.disabled = isSaving;
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        toggleEditing(false);
        updateForm(); // revert form fields to saved profileData
      });
  
      buttonGroup.appendChild(saveBtn);
      buttonGroup.appendChild(cancelBtn);
    }
  }
  
  // Display a message (error or success) and clear it after 3 seconds
  function showMessage(text, type) {
    message.text = text;
    message.type = type;
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = text;
    messageContainer.className = 'message ' + type;
    if (text) {
      setTimeout(() => {
        message.text = '';
        message.type = '';
        messageContainer.textContent = '';
        messageContainer.className = '';
      }, 3000);
    }
  }
  
  // Handle input changes and update profileData accordingly
  function handleInputChange(e) {
    const target = e.target;
    const { name, value, type, checked } = target;
    if (name.indexOf('preferences.') !== -1) {
      const [_, pref] = name.split('.');
      profileData.preferences[pref] = type === 'checkbox' ? checked : value;
    } else {
      profileData[name] = value;
    }
  }
  
  // Handle avatar file selection and update the preview
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        avatarPreview = reader.result;
        document.getElementById('avatar-image').src = avatarPreview;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Handle form submission: validate data and simulate saving
  function handleFormSubmit(e) {
    e.preventDefault();
    isSaving = true;
    toggleEditing(true); // update buttons to reflect saving state
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      showMessage('Please enter a valid email address', 'error');
      isSaving = false;
      toggleEditing(true);
      return;
    }
    
    // Simulate an API call to save profile data
    setTimeout(() => {
      isSaving = false;
      toggleEditing(false);
      showMessage('Profile updated successfully!', 'success');
    }, 1500);
  }
  
  // Initialize after the DOM has loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Simulate fetching user data from a backend after 1 second
    setTimeout(() => {
      profileData = {
        username: 'demo_user',
        email: 'demo@example.com',
        bio: 'This is a sample user bio. Edit it to tell others about yourself!',
        preferences: {
          darkMode: false,
          notifications: true,
          newsletter: false
        }
      };
      updateForm();
    }, 1000);
  
    // Attach event listeners
    const form = document.getElementById('profile-form');
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('input', handleInputChange);
    
    document.getElementById('avatar-input').addEventListener('change', handleAvatarChange);
    document.getElementById('edit-button').addEventListener('click', () => toggleEditing(true));
  });
  