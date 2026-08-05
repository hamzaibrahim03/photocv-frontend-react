<template>
<NavigationRoute />
<HeaderRoute title="" />

<div class="content">
    <section>
        <div class="container">
            <div class="dashboard-card">
                <div class="profile-card" style="width: 100%; height: 100px">
                    <div class="profile-left">
                        <div class="profile-info" style="margin-left:15px">
                            <h2 class="name">Add New Member</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="col-md-8">
        <div id="news">
            <section>
                <div class="container">
                    <div class="news-list">
                        <div class="form-containers">
                            <form @submit.prevent="submitForm">
                                <h5>General Information</h5>
                                <div class="divider3"></div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label> Title </label>
                                        <input type="text" v-model="Title" class="form-control" />
                                    </div>
                                    <div class="col-md-6">
                                        <label> Full Name </label>
                                        <input type="text" v-model="name" class="form-control" />
                                    </div>
                                </div>
                                <div class="divider3"></div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <label> Email </label>
                                        <input type="email" v-model="Title" class="form-control" />
                                    </div>
                                    <div class="col-md-6">
                                        <label> Phone </label>
                                        <input type="number" v-model="name" class="form-control" />
                                    </div>
                                </div>
                                <div class="divider3"></div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <label> Description </label>
                                        <textarea class="form-control"></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label> Image </label>
                                        <input type="file" class="form-control" />
                                    </div>
                                </div>
                                <div class="divider3"></div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <label> Role </label>
                                        <select class="form-control">
                                            <option></option>
                                            <option>Admin</option>
                                            <option>Photographer</option>
                                            <option>Member</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="divider3"></div>

                                <label for="social">Social Media Links</label>
                                <div class="row align-items-center mb-3">
                                    <div class="col">
                                        <label for="facebook" class="form-label">Facebook</label>
                                        <input type="text" class="form-control" placeholder="Facebook link..." />
                                    </div>
                                </div>

                                <div class="row align-items-center mb-3">
                                    <div class="col">
                                        <label for="instagram" class="form-label">Instagram</label>
                                        <input type="text" class="form-control" placeholder="Instagram link..." />
                                    </div>
                                </div>

                                <div class="row align-items-center mb-3">
                                    <div class="col">
                                        <label for="flickr" class="form-label">Flickr</label>
                                        <input type="text" class="form-control" placeholder="Flickr link..." />
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="button-group">
                                        <button class="btn" id="edit">Save</button>
                                        <button class="btn me-2" id="view">Cancel</button>
                                    </div>
                                    <button class="btn me-2" id="view">Back</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
</template>

<script setup>
import NavigationRoute from "@/components/NavigationRoute.vue"
import HeaderRoute from "@/components/HeaderRoute.vue"
</script>

<style scoped>
.container {
     max-width: 1810px;
     padding: 0 15px;
     margin: 0 auto;
}
 .content {
     padding: 0 30px;
}
 .dashboard-card {
     gap: 15px;
     border-radius: 10px;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 20px 0px;
     width: 100%;
}
 .profile-card {
     display: flex;
     align-items: center;
     justify-content: space-between;
     background: white;
     padding: 15px 25px;
     border-radius: 12px;
     width: 65.8%;
     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
     height: 148px;
}
 .profile-left {
     display: flex;
     align-items: left;
}
 .profile-left img {
     width: 100%;
     max-width: 108px;
     height: 108px;
     border-radius: 50%;
}
 .greeting {
     color: #99816b;
     font-weight: 400;
     font-size: 18px;
     line-height: 100%;
     font-family: Inter;
}
 .name {
     font-weight: 500;
     font-size: 30px;
     line-height: 100%;
     color: #4c4036;
     font-family: Inter;
}
 .names {
     font-family: Inter;
     font-weight: 400;
     font-size: 18.68px;
     line-height: 20.76px;
     letter-spacing: 0%;
}
 .namess {
     font-weight: 400;
     font-size: 16px;
     line-height: 100%;
     color: #4c4036;
     padding-left: 20px;
     font-family: Inter;
     text-align: justify;
}
 .left-header-container {
     display: flex;
     align-items: center;
     gap: 10px;
}
 .role {
     color: #cc445e;
     font-weight: 400;
     font-size: 18px;
     line-height: 100%;
     font-family: Inter;
}
 .profile-icons {
     display: flex;
     gap: 10px;
     flex-direction: column;
}
 .profile-icon {
     display: flex;
     flex-direction: column;
}
 .icons {
     display: flex;
     align-items: center;
     color: white;
     font-size: 14px;
     gap: 5px;
}
 .icon {
     display: flex;
     align-items: center;
     color: #cc445e;
     font-size: 14px;
     gap: 5px;
}
 .icon i {
     margin-right: 5px;
}
 .form-control {
     height: 50px;
     font-size: 16.61px;
     font-weight: 400;
     padding: 12px;
     border-radius: 5px;
     color: #4C4036;
     border: 1.04px solid #99816B;
}

</style>
