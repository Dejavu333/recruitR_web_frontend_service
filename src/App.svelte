<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
  import Login from './lib/pages/Auth/Login.svelte';
  import Register from './lib/pages/Auth/Register.svelte';
  import ManageQuizzes from './lib/pages/ManageQuizzes/ManageQuizzes.svelte';
  import AttendQuiz from './lib/pages/AttendQuiz/AttendQuiz.svelte';
  import NotFound from './lib/pages/NotFound/NotFound.svelte';
  import EmailTemplates from './lib/pages/EmailTemplates/EmailTemplates.svelte';
  import Settings from './lib/pages/Settings/Settings.svelte';
  import ManageQuizInstances from './lib/pages/ManageQuizInstances/ManageQuizInstances.svelte';
  import Router from 'svelte-spa-router';
  import Navbar from './lib/shared/Navbar.svelte';

  let loggedIn = true; //todo change to false if not debugging
  const jwt = document.cookie.split(';').find(c => c.trim().startsWith('jwt='));
  if (jwt) {
    loggedIn = true;
  }
  
</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
{#if !loggedIn}
   <p>You must be logged in to view this page.</p>
   <Login />
{:else}
<div id="grid-container">
  <Navbar />
    <main>
      <!-- url sample: host/#/route -->
    <Router routes={{
          '/login': Login,
          '/register': Register,
          '/managequizzes': ManageQuizzes,
          '/managequizinstances': ManageQuizInstances,
          '/emailtemplates': EmailTemplates,
          '/settings': Settings,
          '/attendquiz/:quizaccesstoken': AttendQuiz,
          '*': NotFound,
        }} 
      />  
  </main>
</div>
{/if}
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->

<style>
#grid-container {
  display: grid;
  grid-template-columns: 14% 86%; /* 20% for the menu, 80% for the main content */
  grid-template-rows: 10% 90%; /* 20% for the top row, 80% for the bottom row */
  grid-template-areas:
      "navbar main"
      "navbar main"; 
}

main {
  grid-area: main;
}

</style>
