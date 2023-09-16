<script>
  import { onMount } from "svelte";

  // Function to save content to localStorage
  const saveFile = () => {
    const filename = document.getElementById("filename").value;
    const content = document.getElementById("content").value;

    // Check if filename and content are provided
    if (filename && content) {
      localStorage.setItem(filename, content);

      // Clear the form fields after saving
      document.getElementById("filename").value = "";
      document.getElementById("content").value = "";

      // Update the file list
      updateFileList();
    } else {
      alert("Please provide a filename and content.");
    }
  };

  // Function to update the list of saved files
  const updateFileList = () => {
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "";

    // Get all keys from localStorage (which are the filenames)
    const filenames = Object.keys(localStorage);

    // Create list items for each saved file
    filenames.forEach((filename) => {
      const listItem = document.createElement("li");

      // Create a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", () => deleteFile(filename));

      listItem.textContent = filename;
      listItem.appendChild(deleteButton);

      // Add an event listener to load the content when a file is clicked
      listItem.addEventListener("click", () => loadFile(filename));

      fileList.appendChild(listItem);
    });
  };

  // Function to load the content of a selected file
  const loadFile = (filename) => {
    const content = localStorage.getItem(filename);
    if (content) {
      document.getElementById("filename").value = filename;
      document.getElementById("content").value = content;
    }
  };

  // Function to delete a file
  const deleteFile = (filename) => {
    localStorage.removeItem(filename);
    updateFileList();
  };

  // Call updateFileList on page load to populate the file list
  onMount(() => {
    updateFileList();
  });
</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<div id="page-wrapper" class="clearfix">
  <h1>Mails</h1>
  <p>editor for templating</p>

  <form action="#" method="POST" id="file-form">
    <div class="field">
      <input type="text" name="filename" id="filename" placeholder="Template name">
    </div>
    <div class="field">
      <textarea name="content" id="content" placeholder="Type your content here..."></textarea>
    </div>
    <div class="field">
      <button type="button" on:click={saveFile}>Save Template</button>
      <div id="messages"></div>
    </div>
  </form>

  <div id="files">
    <h2>Templates</h2>
    <ul id="file-list"></ul>
  </div>
</div>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>

#page-wrapper {
  width: 960px;
  background: #FFF;
  padding: 1.25rem;
  margin: 1rem auto;
  min-height: 300px;
  border-top: 5px solid #69c773;
  box-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

#file-form {
  width: 650px;
  float: left;
}

.field {
  margin-bottom: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #D9D9D9;
  border-radius: 3px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}

textarea {
  min-height: 300px;
}

button {
  display: inline-block;
  border-radius: 3px;
  border: none;
  font-size: 0.9rem;
  padding: 0.6rem 1em;
  background: #86b32d;
  border-bottom: 1px solid #5d7d1f;
  color: white;
  margin: 0 0.25rem;
  text-align: center;
}

button:hover {
  opacity: 0.75;
  cursor: pointer;
}

#files {
  width: 230px;
  float: right;
}

#files ul {
  margin: 0;
  padding: 0.5rem 1rem;
  height: 330px;
  overflow-y: auto;
  list-style: none;
  background: #F7F7F7;
  border: 1px solid #D9D9D9;
  border-radius: 3px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1);
}

#files li {
  padding: 0.5rem 0;
}

#messages {
  display: inline-block;
  font-weight: bold;
  color: #69c773;
  margin-left: 1rem;
}

/* Clearfix Utils */

.clearfix {
  *zoom: 1;
}

.clearfix:before,
.clearfix:after {
  display: table;
  line-height: 0;
  content: "";
}

.clearfix:after {
  clear: both;
}
  </style>