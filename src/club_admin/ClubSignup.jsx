import React, { useState } from 'react';

// Assuming step components are converted to React components
import Step1General from '../steps_signup/Step1General';
import Step2Appearance from '../steps_signup/Step2Appearance';
import Step3Membership from '../steps_signup/Step3Membership';
import Step4Content from '../steps_signup/Step4Content';
import Step5Account from '../steps_signup/Step5Account';

// Placeholder for images (adjust paths to work with Create React App/Vite imports)
import clubLogo from '../assets/images/club.png';
import loginBackground from '../assets/images/loginc.png';

const components = [
    Step1General,
    Step2Appearance,
    Step3Membership,
    Step4Content,
    Step5Account
];

const steps = [
    'General Settings',
    'Appearance & Branding',
    'Membership Settings',
    'Content Management',
    'Account Setup'
];

const titles = [
    "Let's Start!",
    "Let's Design!",
    "Let's manage memberships!",
    "Let's manage club website!",
    "You're almost there!"
];

const subtitles = [
    'We just need a few basic details of the club.',
    'Customize your branding and colors.',
    'Set up how people can join your club.',
    'Add photo albums, posts, and galleries.',
    'Finish up by setting admin credentials.'
];

const ClubSignup = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const selectStep = (index) => {
        setCurrentStep(index);
    };

    const CurrentComponent = components[currentStep];

    return (
        <section className="signup-container m-0 p-0 vw-100 vh-100 d-flex overflow-hidden">
            <div className="content-wrapper d-flex w-100 flex-row">
                <div className="form-section d-flex flex-column justify-content-center bg-white" style={{ flex: '0.7', padding: '60px 50px 40px 50px' }}>
                    <div className="logo-wrapper d-flex justify-content-center align-items-center mb-4">
                        <img src={clubLogo} alt="Camera Club Logo" className="logo" style={{ maxWidth: '200px', height: 'auto' }} />
                    </div>

                    <h2 className="title text-center" style={{ fontSize: '48px', fontWeight: '600', color: '#4c4036' }}>{titles[currentStep]}</h2>
                    <p className="subtitle text-center mb-4" style={{ fontSize: '20px', color: '#4c4036' }}>{subtitles[currentStep]}</p>

                    <div className="tab-control position-relative d-flex my-4 px-2">
                        {steps.map((step, index) => (
                            <div key={index} className="step-wrapper d-flex align-items-center position-relative flex-grow-1">
                                <div
                                    className={`step d-flex flex-column align-items-center cursor-pointer ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                    onClick={() => selectStep(index)}
                                    style={{ zIndex: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}
                                >
                                    <span
                                        className="circle d-flex align-items-center justify-content-center rounded-circle fw-bold mb-2"
                                        style={{
                                            width: '32px', height: '32px',
                                            backgroundColor: index <= currentStep ? '#cc445e' : '#eae0d6',
                                            color: index <= currentStep ? '#fff' : '#555',
                                            transition: 'background-color 0.3s, color 0.3s'
                                        }}
                                    >
                                        {index + 1}
                                    </span>
                                    <span
                                        className="label text-center"
                                        style={{
                                            fontSize: '11px',
                                            color: index <= currentStep ? '#cc445e' : '#999',
                                            fontWeight: index <= currentStep ? '500' : 'normal',
                                            transition: 'color 0.3s'
                                        }}
                                    >
                                        {step}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className="line rounded flex-grow-1 mx-1"
                                        style={{
                                            height: '3px',
                                            marginTop: '-20px',
                                            backgroundColor: index < currentStep ? '#cc445e' : '#eae0d6',
                                            zIndex: 1,
                                            transition: 'background-color 0.3s'
                                        }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="component-container mt-4">
                        <CurrentComponent />
                    </div>
                </div>

                <div className="image-section bg-dark d-flex align-items-center overflow-hidden justify-content-end" style={{ flex: '0.3' }}>
                    <img src={loginBackground} alt="Background" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
            </div>
        </section>
    );
};

export default ClubSignup;
