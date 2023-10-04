<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
import { isEmail } from 'validator';
import Config from '../../../config';

let email = '';
let password = '';
const authNRoute = Config.CURATOR_SERVICE_URL + Config.AUTHN_ROUTE;

async function login() {
    //syntactic validation
    if (!isEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }
    try {
      //send request
      const response = await fetch(authNRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      //handle response
      const data = await response.json(); 
      if (data.errcode!=undefined) {
          alert(data.errcode + ' ' + data.detail);
          return;
      }
      document.cookie = `jwt=${data.token}; path=/`; // Store the JWT in a cookie
      document.cookie = `email=${email}; path=/`; // Store the email in a cookie
      window.location = '/#/managequizzes'; // Redirect to the home page

    } catch (err) {
      console.log("Error: ", err);
    }
}
</script>
<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->
<form on:submit={login} id="loginContainer">
  <input type="text" bind:value={email} placeholder="email" />
  <input type="password" bind:value={password} placeholder="password" />
  <button type="submit">login</button>
</form>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>
#loginContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>