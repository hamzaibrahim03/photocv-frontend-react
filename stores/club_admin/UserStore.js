import { defineStore } from "pinia";
import apiClient from "@/api/axios";

export const useUserStore = defineStore("user", {
  state: () => ({

    username: "",
    first_name: "",
    profile_image_url: "",
    tag_line: "",
    role: "",
    role2: "",
    token: localStorage.getItem("token") || "",
    users: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    login(userData) {
      console.log(userData)

      this.username = userData.username || "";
      this.first_name = userData.first_name || "";
      this.profile_image_url = userData.profile_image_url || "";
      this.tag_line = userData.tag_line || "";
      this.token = userData.token || "";
      this.role = userData.role


      localStorage.setItem("token", this.token);
    },

    resetUser() {
      this.username = "";
      this.first_name = "";
      this.profile_image_url = "";
      this.tag_line = "";
      this.token = "";
      this.users = [];
      localStorage.clear();
    },

    async logout() {
      try {
        const response = await apiClient.post('/logout');
        console.log("Logout API success:", response.data);
      } catch (err) {
        console.error("Logout API failed:", err.message);
      }
    
      localStorage.removeItem("token");
      this.resetUser();
    },
    

    async fetchUsers() {
      try {
        const response = await apiClient.post("/login");
        this.users = response.data;
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },

    setUsers(data) {
      this.users = data;
    },
  },
  persist: true,
});
