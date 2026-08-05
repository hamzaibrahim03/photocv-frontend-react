<template>
<div id="app">
    <Navigation v-if="isAuthPage" />
    <router-view />
</div>

<div class="container">
    <div class="login-container">
        <div class="logo-box">
            <img src="@/assets/images/club.png" alt="Camera Club Logo" />
        </div>

        <h3>Login</h3>

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
                    <label for="remember">Remember me</label>
                </div>
                <a href="change_password.html">Forgot Password</a>
            </div>

            <button type="submit" class="btn btn-dark w-100">Login</button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="token" class="success">Login successful! Token: {{ token }}</p>

        <footer class="site-footer">Copyright &copy; 2024 photo.cv</footer>
    </div>

    <div class="image-container" :style="{ backgroundImage: 'url(' + loginImage + ')' }"></div>

</div>
</template>

<script>
import {
    ref
} from "vue";
import {
    useUserStore
} from "@/stores/club_admin/UserStore";
import {
    useRouter
} from "vue-router";
import apiClient from "@/api/axios";
import loginImage from "@/assets/images/sample.png";

export default {
    name: "LoginRoute",
    setup() {
        const username = ref("");
        const password = ref("");
        const error = ref("");
        const router = useRouter();
        const userStore = useUserStore();

        const login = async () => {
            if (!username.value || !password.value) {
                error.value = "Please enter both username and password.";
                return;
            }

            error.value = "";

            try {
                const response = await apiClient.post("/login", {
                    email: username.value,
                    password: password.value,
                });

                const {
                    user,
                    token
                } = response.data.data;

                userStore.role2 = user.roles[0].name;

                userStore.login({
                    username: user.username || "",
                    first_name: user.first_name || "",
                    profile_image_url: user.profile_image_url || "",
                    tag_line: user.tag_line || "",
                    token: token,
                    role: user.roles[0].name,
                });

                if (user.roles[0].name === "club_admin") {
                    router.push("/dashboard");
                } else if (user.roles[0].name === "member") {
                    router.push("/about");
                } else if (user.roles[0].name === "Internal Comp Secretary") {
                    router.push("/");
                }
            } catch (err) {
                error.value = err.response?.data?.message || "Login failed.";
                console.error(err);
            }
        };

        return {
            username,
            password,
            error,
            login,
            loginImage
        };
    },
};
</script>

<style scoped>
body {
     justify-content: center;
     align-items: center;
     background: #fff;
     height: 90vh;
}
 .container {
     display: flex;
     height: 90vh;
     border-radius: 10px;
     overflow: hidden;
     text-align: center;
     justify-content: center;
     align-items: center;
     padding: 0;
}
 .login-container {
     width: 265px;
     flex: 1;
     padding: 50px;
     text-align: center;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     position: relative;
}
 .login-container img {
     width: 435px;
     height: 100px;
     margin-bottom: 115px;
     margin-top: 332px;
     margin-right: 115px;
}
 .form-control {
     border-radius: 5px;
}
 .footer {
     margin-top: 0px;
}
 h3 {
     margin-bottom: 48px;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 36px;
     line-height: 100%;
     letter-spacing: 0%;
     margin-right: 60px;
}
 .inputBox {
     position: relative;
}
 .inputBox input {
     width: 500px;
     height: 60px;
     padding: 10px;
     border: 1px solid #99816b;
     border-radius: 4px;
     outline: none;
     color: black;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 16px;
     line-height: 100%;
     letter-spacing: 0%;
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
 .btn-dark {
     margin-top: 40px;
     border-radius: 5px;
     background-color: #3d302b;
     border: none;
     width: 500px;
     height: 60px;
     color: white;
     font-family: Inter;
     font-weight: 500;
     font-style: Medium;
     font-size: 18px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .btn-dark:hover {
     background-color: #2b1e19;
}
 .remember-forgot {
     display: flex;
     justify-content: space-between;
     align-items: center;
     font-family: Arial, sans-serif;
     font-size: 14px;
     margin-top: 15px;
}
 .remember-left {
     display: flex;
     align-items: center;
     gap: 15px;
     width: 28px;
     height: 28px;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 14px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .remember-forgot a {
     text-decoration: none;
     color: #cc445e;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     font-size: 14px;
     line-height: 100%;
     letter-spacing: 0%;
}
 .remember-forgot a:hover {
     text-decoration: underline;
}
 .image-container {
     flex: 1;
     width: 100px;
     border-top-right-radius: 10px;
     border-bottom-right-radius: 10px;
}
 .site-footer {
     padding: 15px 0;
     text-align: center;
     font-size: 14px;
     color: #99816b;
     bottom: 0;
     left: 0;
     width: 100%;
     position: absolute;
     font-family: Inter;
     font-weight: 400;
     font-style: Regular;
     line-height: 100%;
     letter-spacing: 0%;
}
 @media only screen and (max-width: 1399px) {
     .container {
         height: 60vh;
    }
}
 @media only screen and (max-width: 1199px) {
     .container {
         height: 60vh;
    }
     .login-container img {
         width: 300px;
         margin-bottom: 60px;
         height: 80px;
    }
     h3 {
         font-size: 32px;
    }
     .inputBox input {
         width: 450px;
         height: 50px;
         font-size: 14px;
    }
     .btn-dark {
         height: 50px;
    }
}
 @media only screen and (max-width: 991px) {
     .container {
         height: 60vh;
    }
     .login-container img {
         width: 300px;
         margin-bottom: 60px;
    }
     h3 {
         font-size: 32px;
    }
     .inputBox input {
         width: 450px;
         height: 50px;
         font-size: 14px;
    }
     .btn-dark {
         height: 50px;
    }
}
 @media only screen and (max-width: 767px) {
     .container {
         height: 60vh;
    }
     .login-container img {
         width: 300px;
         margin-bottom: 60px;
    }
     h3 {
         font-size: 32px;
    }
     .inputBox input {
         width: 450px;
         height: 50px;
         font-size: 14px;
    }
     .btn-dark {
         height: 50px;
    }
}
 @media only screen and (max-width: 575px) {
     .container {
         height: 60vh;
    }
     .login-container img {
         width: 300px;
         margin-bottom: 60px;
    }
     h3 {
         font-size: 32px;
    }
     .inputBox input {
         width: 450px;
         height: 50px;
         font-size: 14px;
    }
     .btn-dark {
         height: 50px;
    }
}
 @media only screen and (max-width: 359px) {
     .container {
         height: 60vh;
    }
     .login-container img {
         width: 300px;
         margin-bottom: 60px;
    }
     h3 {
         font-size: 32px;
    }
     .inputBox input {
         width: 450px;
         height: 50px;
         font-size: 14px;
    }
     .btn-dark {
         height: 50px;
    }
}
</style>
