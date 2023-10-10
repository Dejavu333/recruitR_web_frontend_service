<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
  import { broadcastEvent } from "cupevents";
  import { fade, scale } from "svelte/transition";
  import { onMount } from "svelte";
  import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../../store";
  import { isEmail } from 'validator';
  import { CONSTANTS } from "../../../constants";
  import EmailTemplates from "../EmailTemplates/EmailTemplates.svelte";

  // variables, constants
  //====================================================================================================
  export let currentlyEditedQuizTitle = "";
  let candiateEmails = [];
  let selectedEmailTemplate = "";
    
  // setup
  //====================================================================================================
    onMount(() => {
      console.log("QuizInstanceEditor mounted");
    });

  // functions
  //====================================================================================================
  function closeQuizInstanceEditor() {
    broadcastEvent("closeQuizInstanceEditor");
  }

  function deploy(e) {
    console.log("deploy");
  }

  function updateExpiryDate(e) {
    console.log(e.target.value);
  }

  function updateEmailList(e) {
    const emailList = processEmails();
  }

  //test emails: asd@as asd@as.com asd@asd,com asd@asd:com asd@asd..com   asd@asd,com
  //test emails: asd@asd.com,   asd2@asd2.com,, asd3@asd.com aasdasd@asd.com asd@asd..com
  function processEmails() {
    const textarea = document.getElementById("emails");
    let inputText = textarea.value; console.log(inputText);
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = inputText.match(emailRegex); console.log(emails);

    if (emails) {
      textarea.value = "";
      emails.forEach(email => {
        if (isEmail(email)) {
          textarea.value += email + "\n";
        }
        else {
          textarea.value += email + " (invalid email)" + "\n";
        }
      });
    }
    else {
      textarea.value = CONSTANTS.ERRORS.NO_EMAILS_FOUND;
    }
  }

  function clearTextarea() {
    console.log(CONSTANTS.containsError(document.getElementById("emails").value));
    if (CONSTANTS.containsError(document.getElementById("emails").value)) {
      document.getElementById("emails").value = "";
    }
  }

</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<div class="popup-background" in:fade out:fade>
  <div class="popup-content" in:scale out:scale>
    <label for="date">expiry date:</label>
    <br>
    <input type="date" id="date" name="date" placeholder="expiry date" on:input={updateExpiryDate}> <br>
    <label for="emails">emails:</label> 
    <br>
    <textarea id="emails" placeholder="enter candiate emails..." on:blur={updateEmailList}
      on:focus={clearTextarea}></textarea> 
      <br>
    <span>__selected email template__</span>
    <button>select email template</button>
    <textarea id="customEmail" placeholder="enter custom email or select email template..."></textarea>
    <br>
    <button id="closeEditorBtn" on:click={closeQuizInstanceEditor}>close</button>
    <button on:click={deploy}>deploy</button>
  </div>
</div>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>
  #closeEditorBtn {
    float: right;
  }

  /* blur */
  .popup-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .popup-content {
    overflow: hidden;
    min-width: 70rem;
    min-height: 45rem;
    background-color: var(--color-light);
    padding: 0px;
    border-radius: 2rem;
  }

  #emails {
    width: 17rem;
    height: 30rem;
    resize: none;
  }
</style>