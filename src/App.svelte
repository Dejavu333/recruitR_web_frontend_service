<script>
  import Login from './lib/pages/Login.svelte';
  import Register from './lib/pages/Register.svelte';
  import ManageQuizzes from './lib/pages/ManageQuizzes.svelte';
  import AttendQuiz from './lib/pages/AttendQuiz.svelte';
  import NotFound from './lib/pages/NotFound.svelte';
  import EmailTemplates from './lib/pages/EmailTemplates.svelte';
  import Settings from './lib/pages/Settings.svelte';
  import ManageQuizInstances from './lib/pages/ManageQuizInstances.svelte';
  import Router from 'svelte-spa-router';
  import Header from './lib/Header.svelte';
  
</script>

<div id="grid-container">
  <Header />
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


<style>

</style>
