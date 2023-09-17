<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->
<script>
import { isEmail } from 'validator';

let email = '';
let password = '';

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
    //send request
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    //handle response
    if (response.ok) {
      const data = await response.json();
      document.cookie = `jwt=${data.token}; path=/`; // Store the JWT in a cookie
    } else {
      alert(`Login failed. ${response.status} ${response.statusText}`);
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