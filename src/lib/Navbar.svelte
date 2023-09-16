<!---------------------------------------functionality--------------------------------------->
<!---------------------------------------functionality--------------------------------------->

<!---------------------------------------structure--------------------------------------->
<!---------------------------------------structure--------------------------------------->


<div class="contact-form-container navbar">
    <div class="contact-us">
        <div class="contact-header">
            <h1>&#9135;&#9135;&#9135;&#9135;&nbsp;&nbsp;recruitR</h1>
        </div>
        <div class="nav-container">
            <nav>
                <ul>
                    <li><a href="/#/managequizzes">quizzes</a></li>
                    <li><a href="/#/managequizinstances">quiz instances</a></li>
                    <li><a href="/#/emailtemplates">email templates</a></li>
                    <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                    <li><a href="/#/login">login/register</a></li>
                    <li><a href="/#/settings">settings</a></li>
                </ul>
            </nav>
        </div>
    </div>
</div>
<!---------------------------------------style--------------------------------------->
<!---------------------------------------style--------------------------------------->
<style>



.contact-form-container {
    grid-area: navbar;
    position: fixed;
    display: flex;
    background: var(--color-white);
    box-shadow: var(--shadow-primary);
    border-radius: 2rem 2rem 2rem 2rem;
}

        .contact-us {
            position: relative;
            min-width: 14vw;
            height: 98vh;
            background: var(--color-light);
            overflow: hidden;
            border-radius: 2rem 2rem 2rem 2rem;
            box-shadow: var(--shadow-primary);
        }

        .contact-us:before {
            content: "";
            position: absolute;
            bottom: -2rem;
            left: -6rem;
            height: 15rem;
            width: 35rem;
            background: var(--color-secondary);
            transform: rotate(25deg);
            box-shadow: 0 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
        }

        .contact-us:after {
            content: "";
            position: absolute;
            bottom: -2rem;
            right: -10rem;
            height: 15rem;
            width: 30rem;
            background: var(--color-primary);
            transform: rotate(-25deg);
            box-shadow: 0 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
        
        }

        .contact-header {
            color: white;
            position: absolute;
            transform: rotate(-90deg);
            top: 6rem;
            left: -5rem;
        }

        .contact-header h1 {
            white-space: nowrap;
            margin-left: 1rem;
        }

        .nav-container {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }

        nav ul {
            text-align: center ;
            list-style-type: none;
            width: 100%;
        }

        nav li {
            padding: 0.4rem 0;
            white-space: nowrap;
        }

        nav a {
            text-decoration: none;
            color: var(--color-grey);
            font-weight: 400;
        }
        nav a:hover {
            color: #000;
        }

</style>