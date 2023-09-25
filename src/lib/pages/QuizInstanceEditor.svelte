<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
    import { broadcastEvent } from "cupevents";
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";
    import { QuizDTO, QuizQuestionDTO, quizzesStore } from "../../Store";

    onMount (() => {
        console.log("QuizInstanceEditor mounted");
    });

    function closeQuizInstanceEditor() {
        broadcastEvent("closeQuizInstanceEditor");
    }

    function deploy(e) {
        console.log("deploy");
    }

</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
  <div class="popup-background" in:fade out:fade>
    <div class="popup-content">
        <input type="date" id="date" name="date" placeholder="expiry date"> <br>
        <textarea id="emails" placeholder="emails"></textarea> <br>
        <span>__selected email template__</span>
        <button>select email template</button>
        <textarea id="customEmail" placeholder="custom email"></textarea>
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
      background: rgba(0, 0, 0, 0.5); /* semi-transparent background */
      backdrop-filter: blur(10px); /* applies blur to the background */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }

    .popup-content {
      min-width: 75vw;
      background-color: var(--color-white);
      padding: 20px;
      border-radius: 2rem;
    }
  </style>
