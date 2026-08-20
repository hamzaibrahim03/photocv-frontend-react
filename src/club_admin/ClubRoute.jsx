import React, { useState, useEffect } from 'react';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';

// Import all step components 
// (assuming these exist and have also been converted to React, or will be)
// import Step1General from '../steps_club/Step1General';
// import Step2Appearance from '../steps_club/Step2Appearance';
// import Step3Membership from '../steps_club/Step3Membership';
// import Step4Content from '../steps_club/Step4Content';
// import Step5Privacy from '../steps_club/Step5Privacy';

function ClubRoute({
    greeting = "Viewing Core Club Settings",
    name = "Club Settings",
    role = "All changes are applied instantly",
}) {
    const steps = ['General Settings', 'Appearance & Branding', 'Membership Settings', 'Content Management', 'Privacy Settings'];
    const [currentStep, setCurrentStep] = useState(0);

    const [memberCount, setMemberCount] = useState(0);
    const [eventDay, setEventDay] = useState(0);

    const selectStep = (index) => {
        setCurrentStep(index);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Mock: Replace with actual fetch logic for club setup/events
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);



    return (
        <div style={{ backgroundColor: '#f5f0eb', minHeight: '100vh' }}>
            <NavigationRoute />
            <HeaderRoute title="Club" />

            <section className="content">
                <div className="container" style={{ maxWidth: '1820px' }}>
                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                        <div className="profile-card">
                            <div className="profile-left">
                                <div className="profile-info">
                                    <small className="greeting">{greeting}</small>
                                    <h2 className="name">{name}</h2>
                                    <small className="role">{role}</small>
                                </div>
                            </div>

                            <div className="dt-search mx-auto">
                                <input type="search" className="form-control" id="dt-search-1" placeholder="Search" aria-controls="example1" />
                            </div>
                        </div>

                        <div className="card-section d-flex gap-4">
                            <div className="stat-card text-white text-center rounded p-4" style={{ backgroundColor: '#cc445e', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Members</small>
                                <h3 className="number mt-4" style={{ fontSize: '48px', fontWeight: '500' }}>{memberCount}</h3>
                            </div>
                            <div className="event-card text-white text-center rounded p-4" style={{ backgroundColor: '#755840', width: '219px', height: '148px' }}>
                                <small className="ca-details" style={{ fontSize: '20px' }}>Next Event</small>
                                <div className="row mt-4">
                                    <div className="col-md-5">
                                        <h3 className="number m-0" style={{ fontSize: '48px', fontWeight: '500' }}>{eventDay}</h3>
                                    </div>
                                    <div className="days col-md-7 text-start">
                                        <span style={{ fontSize: '16px' }}>days to go</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tab-control d-flex justify-content-between mb-4 gap-3">
                        {steps.map((step, index) => (
                            <div key={index} className={`step d-flex flex-column align-items-center flex-grow-1 cursor-pointer ${index === currentStep ? 'active' : ''}`} onClick={() => selectStep(index)} style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                <span className="circle d-flex align-items-center justify-content-center rounded-circle fw-bold text-white mb-2" style={{ width: '40px', height: '40px', fontSize: '18px', backgroundColor: index === currentStep ? '#CC445E' : '#ccc' }}>
                                    {index + 1}
                                </span>
                                <span className="label text-center" style={{ fontSize: '14px', color: index === currentStep ? '#CC445E' : '#333', fontWeight: index === currentStep ? 'bold' : 'normal' }}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* <div className="step-content mt-4">
                        {currentStep === 0 && <Step1General />}
                        {currentStep === 1 && <Step2Appearance />}
                        {currentStep === 2 && <Step3Membership />}
                        {currentStep === 3 && <Step4Content />}
                        {currentStep === 4 && <Step5Privacy />}
                    </div> */}
                </div>
            </section>
        </div>
    );
};

export default ClubRoute;
