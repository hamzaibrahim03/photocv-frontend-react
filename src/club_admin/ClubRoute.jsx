import React, { useState, useEffect } from 'react';
import NavigationRoute from './NavigationRoute';
import HeaderRoute from './HeaderRoute';
import Loader from "../React/extra/LoaderAll.jsx";
import Image from "./assets/icons/dashboard/profile_image.svg";
import Comment from "./assets/icons/dashboard/comment.svg";
import Point from "./assets/icons/dashboard/point.svg";
import Step1General from '../../steps_club/Step1General.jsx';
import Step2Appearance from '../../steps_club/Step2Appearance.jsx';
import Step3Membership from '../../steps_club/Step3Membership.jsx';
import Step4Content from '../../steps_club/Step4Content.jsx';
import Step5Privacy from '../../steps_club/Step5Privacy.jsx';
import Step1GeneralConfiguration from '../../steps_club_configuration/Step1General.jsx';
import Step2News from '../../steps_club_configuration/Step2News.jsx';
import Step3Events from '../../steps_club_configuration/Step3Events.jsx';
import Step4Galleries from '../../steps_club_configuration/Step4Galleries.jsx';
import Step5Competitions from '../../steps_club_configuration/Step5Competitions.jsx';
import Step1Competition from '../../steps_club_defaults/Step1Competition.jsx';
function ClubRoute() {
    const [dashboardData, setDashboardData] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getDashboardData();
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    async function getDashboardData() {
        const url = 'http://rytonlocal-staging.cameraclub.website:8000/api/v1/club/dashboard'
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await response.json();
        console.log(data);
        setDashboardData(data.data);
    };
    console.log(dashboardData)
    const hour = new Date().getHours();
    const greetingMessage = () => {
        if (hour >= 5 && hour < 12) return "Good morning!";
        if (hour === 12) return "Good noon!";
        if (hour > 12 && hour < 17) return "Good afternoon!";
        if (hour >= 17 && hour < 21) return "Good evening!";
        return "Good night!";
    };
    const settingsSteps = ['General Settings', 'Appearance & Branding', 'Membership Settings', 'Content Management', 'Privacy Settings'];
    const configurationSteps = ['General', 'News', 'Events', 'Galleries', 'Competitions'];
    const defaultsSteps = ['Competitions'];
    const [settingsStep, setSettingsStep] = useState(0);
    const [configurationStep, setConfigurationStep] = useState(0);
    const [defaultsStep, setDefaultsStep] = useState(-1);
    const selectSettingsStep = (index) => {
        setSettingsStep(index);
    };
    const selectConfigurationStep = (index) => {
        setConfigurationStep(index);
    };
    const selectDefaultsStep = (index) => {
        setDefaultsStep(index);
    };
    useEffect(() => {
        const fetchEvents = async () => {
            try {
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);
    return (
        <>
            <div style={{ backgroundColor: 'white' }}>
                <Loader show={isLoading} />
                {!isLoading && (
                    <>
                        <NavigationRoute />
                        <HeaderRoute title="Admin" />
                        <div className="content">
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="dashboard-card d-flex align-items-center justify-content-between py-4 gap-3">
                                        <div className="profile-card">
                                            <div className="profile-left">
                                                <img className="img-fluid" src={dashboardData?.user_details?.profile_image} alt="Profile Picture" />
                                                <div className="profile-info">
                                                    <span className="greeting">
                                                        {greetingMessage()}
                                                    </span>
                                                    <h2 className="name">
                                                        {dashboardData?.user_details?.first_name + " " + dashboardData?.user_details?.last_name}
                                                    </h2>
                                                    <p className="role">
                                                        {dashboardData?.user_details?.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="profile-icons">
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_photos}</span>
                                                    <img src={Image} alt="image-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_comments}</span>
                                                    <img src={Comment} alt="comment-icon" />
                                                </div>
                                                <div className="icon">
                                                    <span style={{ color: 'black' }}>{dashboardData?.clubGalleries?.original?.data?.total_likes}</span>
                                                    <img src={Point} alt="point-icon" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-section">
                                            <div className="stat-card">
                                                <small className="ca-details">Members</small>
                                                <h3 className="number">{String(dashboardData?.total_members_count).padStart(2, "0")}</h3>
                                            </div>
                                            <div className="event-cards">
                                                {dashboardData?.upcoming_event?.remaining_days !== undefined &&
                                                    dashboardData?.upcoming_event?.remaining_days !== null ? (
                                                    <>
                                                        <small className="ca-details">Next Event</small>
                                                        <div className="row">
                                                            <div className="col-md-5">
                                                                <h3 className="number">{String(dashboardData?.upcoming_event?.remaining_days).padStart(2, '0')}</h3>
                                                            </div>
                                                            <div className="days col-md-7">
                                                                <span>days to go</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                            <path d="M8.4 8.3999C7.69687 8.70665 7.09678 9.20911 6.67125 9.8474C6.24572 10.4857 6.01272 11.2329 6 11.9999V39.9999C6 41.0608 6.42143 42.0782 7.17157 42.8283C7.92172 43.5785 8.93913 43.9999 10 43.9999H38C38.7694 43.9983 39.5221 43.7748 40.1677 43.3562C40.8133 42.9376 41.3245 42.3417 41.64 41.6399" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 31V12C42 10.9391 41.5786 9.92172 40.8284 9.17157C40.0783 8.42143 39.0609 8 38 8H19" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32 4V12" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 20H20" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M42 20H31" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 4L44 44" stroke="#8EA390" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <h3 className="days">
                                                            No upcoming events
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="more-card" style={{ width: '100%' }}>
                                        <h5 className='head'>Settings</h5>
                                        <h5 className='role'>Control the essential that shape your club</h5>
                                        <h5 className='text-secondary'>Manage everything from general preferences to appearance, branding, memberships, content, and privacy. All in one place for your ease!</h5>
                                        <hr />
                                        <div className="tab-control d-flex justify-content-between mb-4 gap-3">
                                            {settingsSteps.map((step, index) => (
                                                <div key={index} className={`step d-flex flex-column align-items-center flex-grow-1 cursor-pointer ${index === settingsStep ? 'active' : ''}`} onClick={() => selectSettingsStep(index)} style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                                    <span className="circle d-flex align-items-center justify-content-center rounded-circle head text-white mb-2" style={{ width: '40px', height: '40px', fontSize: '18px', backgroundColor: index === settingsStep ? '#CC445E' : '#ccc' }}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="label text-center" style={{ fontSize: '14px', color: index === settingsStep ? '#CC445E' : '#333', fontWeight: index === settingsStep ? 'bold' : 'normal' }}>
                                                        {step}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="step-content mt-4">
                                        {settingsStep === 0 && <Step1General />}
                                        {settingsStep === 1 && <Step2Appearance />}
                                        {settingsStep === 2 && <Step3Membership />}
                                        {settingsStep === 3 && <Step4Content />}
                                        {settingsStep === 4 && <Step5Privacy />}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: '1820px' }}>
                                    <div className="more-card" style={{ width: '100%' }}>
                                        <h5 className='head'>Configuration</h5>
                                        <h5 className='role'>Customise modules and make them work your way.</h5>
                                        <h5 className='text-secondary'>Personalize your modules such as news, events, galleries, and competitions. Enable, disable, or adjust them to fit your club’s needs.</h5>
                                        <hr />
                                        <div className="tab-control d-flex justify-content-between mb-4 gap-3">
                                            {configurationSteps.map((step, index) => (
                                                <div key={index} className={`step d-flex flex-column align-items-center flex-grow-1 cursor-pointer ${index === configurationStep ? 'active' : ''}`} onClick={() => selectConfigurationStep(index)} style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                                    <span className="circle d-flex align-items-center justify-content-center rounded-circle head text-white mb-2" style={{ width: '40px', height: '40px', fontSize: '18px', backgroundColor: index === configurationStep ? '#CC445E' : '#ccc' }}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="label text-center" style={{ fontSize: '14px', color: index === configurationStep ? '#CC445E' : '#333', fontWeight: index === configurationStep ? 'bold' : 'normal' }}>
                                                        {step}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="step-content mt-4">
                                        {configurationStep === 0 && <Step1GeneralConfiguration />}
                                        {configurationStep === 1 && <Step2News />}
                                        {configurationStep === 2 && <Step3Events />}
                                        {configurationStep === 3 && <Step4Galleries />}
                                        {configurationStep === 4 && <Step5Competitions />}
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="container" style={{ maxWidth: "1820px" }}>
                                    {defaultsStep === -1 ? (
                                        <div className="more-card" style={{ width: "100%" }}>
                                            <h5 className="head">Defaults</h5>
                                            <h5 className="role">
                                                Save time with smart presets.
                                            </h5>
                                            <h5 className="text-secondary">
                                                Set up default values for new items so you don’t have to
                                                repeat the same steps every time. Perfect for competitions,
                                                events, or any recurring content.
                                            </h5>
                                            <hr />
                                            <div className="tab-control d-flex justify-content-between mb-4 gap-3">
                                                {defaultsSteps.map((step, index) => (
                                                    <div key={index} className={`step d-flex flex-column align-items-center flex-grow-1 ${index === defaultsStep ? "active" : ""}`} onClick={() => selectDefaultsStep(index)} style={{ cursor: "pointer", transition: "all 0.3s ease", }}>
                                                        <span className="circle d-flex align-items-center justify-content-center rounded-circle head text-white mb-2"
                                                            style={{ width: "40px", height: "40px", fontSize: "18px", backgroundColor: index === defaultsStep ? "#CC445E" : "#ccc", }}>
                                                            {index + 1}
                                                        </span>
                                                        <span className="label text-center" style={{ fontSize: "14px", color: index === defaultsStep ? "#CC445E" : "#333", fontWeight: index === defaultsStep ? "bold" : "normal", }}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="step-screen">
                                            <button type="button" className="btn btn-sm mb-3" onClick={() => setDefaultsStep(-1)}>
                                                <i className="fa-solid fa-arrow-left"></i>
                                                &nbsp; Back
                                            </button>
                                            {defaultsStep === 0 && (
                                                <Step1Competition />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                )
                }
            </div>
        </>
    );
};
export default ClubRoute;
