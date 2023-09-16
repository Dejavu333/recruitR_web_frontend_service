<div class="navbar">
    <div class="logo">
        <img src="mainLogo.png" alt="Logo">
    </div>
    <ul class="menu">
        <li><a href="/#/managequizzes">quizzes</a></li>
        <li><a href="/#/managequizinstances">quiz instances</a></li>
        <li><a href="/#/emailtemplates">email templates</a></li>
        <li><a href="/#/login">login/register</a></li>
        <li><a href="/#/settings">settings</a></li>
    </ul>
</div>

<style>
.navbar {
    width: 10%;
    background-color: var(--color-primary);
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    z-index: 100;
    /* right border */
    border-right: 4px solid var(--color-primary-light);
}

.logo img {
    height: 200px;
}

/* Style the menu items */
.menu {
    list-style: none;
    margin-top: 20px;
}

.menu li {
    border: 2px solid var(--color-primary-light);
    width: 150px;
    height: 50px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>