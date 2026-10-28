import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import apiClient from '../api/axios';
import sample from './assets/images/sample.png';
import club from './assets/images/club.png';
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
        if (index >= 0 && index < steps.length && index <= currentStep) {
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
            navigate('/login');
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
        <div className="sp-page">
            <div className="sp-form-side">
                <div className="sp-card" style={{maxWidth: '1000%'}}>
                    <img src={club} alt=""/>

                    <div className="sp-step-header" key={`header-${currentStep}`} style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h2 className="sp-title">{titles[currentStep]}</h2>
                        <p className="sp-subtitle">{subtitles[currentStep]}</p>
                    </div>
                    
                    <div className="sp-stepper">
                        {steps.map((step, index) => (
                            <div key={index} className="sp-step-wrap">
                                <button type="button" className={`sp-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`} onClick={() => selectStep(index)} disabled={index > currentStep} >
                                    <span className="sp-step-circle">
                                        {index < currentStep ? <i className="fa-solid fa-check sp-check"></i> : index + 1}
                                    </span>
                                    <span className="sp-step-label">{step}</span>
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`sp-step-line ${index < currentStep ? 'done' : ''}`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    

                    {submitError && <div className="sp-error">{submitError}</div>}

                    <div className="sp-step-body" key={`body-${currentStep}`}>
                        <CurrentComponent formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} onSkip={handleSkip} onSubmit={handleSubmit} submitting={submitting} />
                    </div>
                </div>
            </div>
            <div className="sp-image-side">
                <img src={sample} alt="" />
                <div className="sp-image-overlay">
                    <div className="sp-image-caption">
                        <h4>Bring your club online</h4>
                        <p>Set up galleries, competitions, events and members in a few guided steps.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClubSignup;
