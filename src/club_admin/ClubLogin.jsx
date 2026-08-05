<template>
<div class="login-container">
    <img src="@/assets/images/club.png" alt="Logo" class="top-logo" />

    <div class="login-box">
        <div class="left-box">
            <h2>Login</h2>

            <p class="text-secondary">Log in to access your club dashboard.</p>

            <form @submit.prevent="login">
                <div class="inputBox mb-3">
                    <input type="text" v-model="username" class="form-control" required />
                </div>
                <div class="inputBox mb-3">
                    <input type="password" v-model="password" class="form-control" required />
                </div>

                <div class="remember-forgot">
                    <div class="remember-left">
                        <input type="checkbox" id="remember" />
                        <span for="remember">Remember me</span>
                    </div>
                    <a href="change_password.html">Forgot Password</a>
                </div>

                <button type="submit" class="btn btn-dark">Login</button>
            </form>

        </div>
        <div class="or-divider">
            <span>OR</span>
        </div>

        <div class="right-box">
            <h3>Create your club website in minutes... Honestly!</h3>
            <p>
                No tech headaches, no long forms. Just pick a name, choose a look,
                and you're live. Perfect for clubs that want to make an impact
                without the hassle.
            </p>
            <a href="/signup"><button class="start-btn">Let's Get Started</button></a>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const remember = ref(false);

const login = () => {
    console.log({
        email: email.value,
        password: password.value,
        remember: remember.value
    });
};
</script>

<style scoped>
.login-container {
     min-height: 100vh;
     display: flex;
     max-width: 1500px;
     width: 100%;
     flex-direction: column;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     border-radius: 8px;
     overflow: hidden;
     background-color: white;
     align-items: center;
}
 .login-box {
     display: flex;
     max-width: 1500px;
     width: 100%;
     overflow: hidden;
}
 .left-box, .right-box {
     flex: 1;
     padding: 40px;
     display: flex;
     flex-direction: column;
     justify-content: center;
}
.left-box h2 {
     font-family: Inter; 
     font-weight: 600; 
     font-style: Semi Bold; 
     font-size: 48px; 
     text-align: center; 
     color: #4C4036;
}
.left-box p {
     text-align: center;
}
.right-box p {
     text-align: center; 
     width: 500px
}
 .logo-wrapper {
     display: flex;
     justify-content: center;
     margin-bottom: 20px;
}
 .logo {
     width: 150px;
}
 .or-divider {
     display: flex;
     flex-direction: row;
     align-items: center;
     justify-content: center;
     margin: 20px 0;
     rotate: 270deg;
}
 .or-divider::before, .or-divider::after {
     content: '';
     height: 1px;
     width: 10px;
     background-color: #ccc;
}
 .or-divider span {
     color: #666;
     font-size: 13px;
     font-weight: 500;
}
 .inputBox {
     position: relative 
}
 .inputBox input {
     width: 600px;
     height: 50px;
     padding: 10px 14px;
     margin-bottom: 15px;
     border: 1px solid #ccc;
     border-radius: 5px;
     font-size: 14px;
}
 .inputBox span {
     position: absolute;
     top: -18px;
     left: 15px;
     padding: 0 5px;
     font-size: 1.2rem;
     color: black;
     pointer-events: none;
     transition: none;
}
 .inputBox input:focus~span, .inputBox input:valid~span {
     transform: translateY(-20px);
     background: #fff;
     padding: 0 5px;
     font-size: 1rem;
}
 .remember-forgot {
     display: flex;
     justify-content: space-between;
     align-items: center;
     font-family: Arial, sans-serif;
     font-size: 14px;
     margin-top: 10px;
}
 .remember-left {
     font-size: 16px;
     display: flex;
     align-items: center;
     gap: 8px;
}
 .remember-forgot a {
     text-decoration: none;
     color: #cc445e
}
 .remember-forgot a:hover {
     text-decoration: underline;
}
 .btn-dark {
     margin-top: 10px;
     border-radius: 5px;
     background-color: #3d302b;
     border: none;
     font-size: 1.5rem;
     width: 600px;
     height: 60px;
     color: white;
}
 .btn-dark:hover {
     background-color: #2b1e19;
}
 .right-box h3 {
     font-family: Inter;
     font-weight: 600;
     font-style: Semi Bold;
     font-size: 48px;
     text-align: center;
}
 .right-box .start-btn {
     font-family: Inter;
     font-weight: 500;
     font-size: 18px;
     width: 500px;
     height: 60px;
     opacity: 1;
     border-radius: 7px;
     background-color: #CC445E;
     color: white;
}
 footer {
     text-align: center;
     margin-top: 20px;
     font-size: 12px;
     color: #999;
}
</style>
