<template>
<div class="form">
    <label for="username"> Username </label>
    <input type="text" class="form-control" />

    <div class="row">
        <div class="col-md-6">
            <label for="password">Password</label>
            <input type="password" class="form-control" />
        </div>
        <div class="col-md-6">
            <label for="password">Confirm Password</label>
            <input type="password" class="form-control" />
        </div>
    </div>
    <div class="button-group" style="justify-content:left">
        <button class="btn btn-sm" id="view">Previous</button>
        <button class="btn btn-sm" id="edit" style="max-width: 150px">Launch Club</button>
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
