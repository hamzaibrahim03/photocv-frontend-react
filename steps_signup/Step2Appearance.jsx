<template>
<div class="form">
    <div class="row">
        <div class="col-md-6">
            <label for="theme"> Theme & Colours </label>
            <img src="@/assets/images/club/theme.png" alt="theme" /><br />
        </div>
        <div class="col-md-6">
            <label for="fonts"> Typography & Fonts </label>
            <img src="@/assets/images/club/font.png" alt="font" style="height: 180px" />
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 mb-3">
            <label for="logo"> Logo </label>
            <input type="file" class="form-control" />
        </div>
        <div class="col-md-6 mb-3">
            <label for="banner"> Club Banner and Cover Image </label>
            <input type="file" class="form-control" />
        </div>
    </div>
    <div class="button-group" style="justify-content:left">
        <button class="btn btn-sm" id="view">Previous</button>
        <button class="btn btn-sm" id="edit">Next</button>
        <a href="#" style="color: #cc445e">Skip</a>
    </div>
</div>
</template>

<style scoped>
.form {
     display: flex;
     flex-direction: column;
     gap: 24px;
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
