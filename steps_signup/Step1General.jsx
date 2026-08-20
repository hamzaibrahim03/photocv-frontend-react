<template>
    <ClubSignup title="Let's Start!" subtitle="We just need a few basic details of the club." />
    <div className="form">
        <h5 className="head">Basic Details</h5>
        <div className="row">
            <div className="col-md-6 mb-3">
                <label for="names"> Club Name </label>
                <input type="text" className="form-control" />
            </div>
            <div className="col-md-6 mb-3">
                <label for="tagline"> Club Tagline </label>
                <input type="text" className="form-control" />
            </div>
        </div>
        <h5 className="fw-semibold mb-3">Domain Type and Name Options</h5>

        <div className="row">

            <div className="col-md-6">
                <div className="form-check">
                    <div className="row">
                        <div className="col-md-4">
                            <input className="form-check-input" type="radio" name="domain_type" id="subdomain" value="subdomain">
                                <label className="form-check-label fw-semibold" for="subdomain">
                                    Subdomain
                                </label>
                        </div>
                        <div className="col-md-8">
                            <span className="small text-muted d-block ms-4 mt-1">
                                Use our domain, type your name
                            </span>
                        </div>
                    </div>
                </div>

                <div className="input-group mt-3">
                    <input type="text" className="form-control" v-model="domainName" placeholder="yourclubname" />
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        {{ selectedDomain }}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li v-for="item in domainOptions" key="item">
                            <a className="dropdown-item" href="#" @click.prevent="selectDomain(item)">
                            {{ item }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div className="col-md-6">
            <div className="form-check mb-2">
                <div className="row">
                    <div className="col-md-6">
                        <input className="form-check-input" type="radio" name="domain_type" id="customdomain" value="customdomain">
                            <label className="form-check-label fw-semibold" for="customdomain">
                                Custom Domain
                            </label>
                    </div>
                    <div className="col-md-6">
                        <span className="small text-muted d-block ms-4 mt-1">Use your own domain</span>
                    </div>
                </div>
            </div>
            <input type="text" className="form-control mt-3" placeholder="example.com">
        </div>

    </div>

    <div className="button-group" style={{ justify- content:left">
    <button className="btn btn-sm" id="edit">Next</button>
</div>
</div >
</template >

<script setup>
import { ref } from 'vue';

const domainName = ref("");
const selectedDomain = ref(".cameraclub.website");

const domainOptions = [
    ".cameraclub.website",
    ".ca.cameraclub.website",
    ".uk.cameraclub.website",
    ".aus.cameraclub.website",
];

const selectDomain = (item) => {
    selectedDomain.value = item;
};
</script>

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
