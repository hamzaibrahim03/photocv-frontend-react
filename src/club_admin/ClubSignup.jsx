import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import apiClient from '../api/axios';
import Step1GeneralSignup from '../../steps_signup/Step1General';
import Step2AppearanceSignup from '../../steps_signup/Step2Appearance';
import Step3MembershipSignup from '../../steps_signup/Step3Membership';
import Step4ContentSignup from '../../steps_signup/Step4Content';
import Step5AccountSignup from '../../steps_signup/Step5Account';
const components = [
    Step1GeneralSignup,
    Step2AppearanceSignup,
    Step3MembershipSignup,
    Step4ContentSignup,
    Step5AccountSignup
];
const steps = [ 'General Settings', 'Appearance & Branding', 'Membership Settings', 'Content Management', 'Account Setup' ];
const titles = [ "Let's Start!", "Let's Design!", "Let's manage memberships!", "Let's manage club website!", "You're almost there!" ];
const subtitles = [ 'We just need a few basic details of the club.', 'Customize your branding and colors.', 'Set up how people can join your club.', 'Add photo albums, posts, and galleries.', 'Finish up by setting admin credentials.' ];

const INITIAL_FORM_DATA = {
    club_name: '',
    tag_line: '',
    domain_type: 'subdomain',
    domain_name: '',
    logo: null,
    banner: null,
    registration: 'open',
    directory_visibility: 'visible',
    comments: 'disabled',
    likes: 'disabled',
    website_sections: 'News',
    comment_preference: 'All',
    reminders: 'all',
    email: '',
    username: '',
    password: '',
};

function ClubSignup() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const updateFormData = (fields) => { setFormData((prev) => ({ ...prev, ...fields })); };
    const selectStep = (index) => {
        if (index >= 0 && index < steps.length) {
            setCurrentStep(index);
        }
    };
    const handleNext = () => { setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1)); };
    const handlePrevious = () => { setCurrentStep((prev) => Math.max(prev - 1, 0)); };
    const handleSkip = () => { setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1)); };

    const handleSubmit = async () => {
        setSubmitError('');
        setSubmitting(true);
        try {
            const payload = new FormData();
            payload.append('username', formData.username);
            payload.append('email', formData.email);
            payload.append('password', formData.password);
            payload.append('role', 'club_admin');
            payload.append('club[club_name]', formData.club_name);
            payload.append('club[tag_line]', formData.tag_line);
            payload.append('club[domain_type]', formData.domain_type === 'customdomain' ? 'custom' : 'subdomain');
            payload.append('club[domain_name]', formData.domain_name);
            payload.append('club[registration]', formData.registration);
            payload.append('club[directory_visibility]', formData.directory_visibility);
            payload.append('club[comments]', formData.comments);
            payload.append('club[likes]', formData.likes);
            payload.append('club[website_sections]', formData.website_sections);
            payload.append('club[comment_preference]', formData.comment_preference);
            payload.append('club[reminders]', formData.reminders);
            if (formData.logo instanceof File) payload.append('club[logo]', formData.logo);
            if (formData.banner instanceof File) payload.append('club[banner]', formData.banner);

            await apiClient.post('/sign-up', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/admin/login');
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;
            if (status === 409) {
                setSubmitError(message || 'Username or email already in use.');
            } else {
                setSubmitError(message || 'Something went wrong while creating your club. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const CurrentComponent = components[currentStep];
    return (
        <section className="signup-container m-0 p-0 vw-100 vh-100 d-flex overflow-hidden">
            <div className="container">
                <div className="content-wrapper d-flex w-100 flex-row">
                    <div className="form-section d-flex flex-column justify-content-center bg-white" style={{ flex: '0.7', padding: '60px 50px 40px 50px' }}>
                        <div className="logo-wrapper d-flex justify-content-center align-items-center mb-4">
                        </div>
                        <h2 className="title text-center" style={{ fontSize: '48px', fontWeight: '600', color: '#4c4036' }}>{titles[currentStep]}</h2>
                        <p className="subtitle text-center mb-4" style={{ fontSize: '20px', color: '#4c4036' }}>{subtitles[currentStep]}</p>
                        <div className="tab-control position-relative d-flex my-4 px-2">
                            {steps.map((step, index) => (
                                <div key={index} className="step-wrapper d-flex align-items-center position-relative flex-grow-1">
                                    <div className={`step d-flex flex-column align-items-center cursor-pointer ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`} onClick={() => selectStep(index)} style={{ zIndex: 2, cursor: 'pointer', transition: 'all 0.3s ease' }}>
                                        <span className="circle d-flex align-items-center justify-content-center rounded-circle head mb-2" style={{ width: '32px', height: '32px', backgroundColor: index <= currentStep ? '#cc445e' : '#eae0d6', color: index <= currentStep ? '#fff' : '#555', transition: 'background-color 0.3s, color 0.3s' }}>
                                            {index + 1}
                                        </span>
                                        <span className="label text-center" style={{ fontSize: '11px', color: index <= currentStep ? '#cc445e' : '#999', fontWeight: index <= currentStep ? '500' : 'normal', transition: 'color 0.3s' }}>
                                            {step}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="line rounded flex-grow-1 mx-1" style={{ height: '3px', marginTop: '-20px', backgroundColor: index < currentStep ? '#cc445e' : '#eae0d6', zIndex: 1, transition: 'background-color 0.3s' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {submitError && (
                            <div className="alert alert-danger" role="alert" style={{ fontSize: 14 }}>{submitError}</div>
                        )}
                        <div className="component-container mt-4">
                            <CurrentComponent
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                onSkip={handleSkip}
                                onSubmit={handleSubmit}
                                submitting={submitting}
                            />
                        </div>
                    </div>
                    <div className="image-section bg-dark d-flex align-items-center overflow-hidden justify-content-end" style={{ flex: '0.3' }}>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ClubSignup;
