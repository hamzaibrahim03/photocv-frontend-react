import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import apiClient from '../api/axios';
import '../club_admin/assets/css/signupstyle.css';
import sample from '../club_admin/assets/images/sample.png';
import photo from '../club_admin/assets/images/photo.png';
import Step1SettingsSignup from '../../steps_photo_signup/Step1Settings';
import Step2BrandingSignup from '../../steps_photo_signup/Step2Branding';
import Step3ProfileSignup from '../../steps_photo_signup/Step3Profile';
import Step4ContactSignup from '../../steps_photo_signup/Step4Contact';
import Step5SetupSignup from '../../steps_photo_signup/Step5Setup';
import "../club_admin/assets/css/adminstyle.css"
const components = [
    Step1SettingsSignup,
    Step2BrandingSignup,
    Step3ProfileSignup,
    Step4ContactSignup,
    Step5SetupSignup
];
const steps = [
    'General Settings',
    'Appearance & Branding',
    'Profile Settings',
    'Contact Info',
    'Account Setup'
];
const titles = [
    "Let's start!",
    "Let's define your look!",
    "Let’s personalize your profile!",
    "Let's stay connected!",
    "You’re almost there!"
];
const subtitles = [
    'Choose a custom domain and write a tagline that reflects your photography style',
    'Set up your profile details and tell us about your photography style or specialties',
    'Set up your profile details and tell us about your photography interest and brands.',
    'Add your contact info and socials so people can reach out and follow your work.',
    "Let's lock in your username and password to launch your website."
];

const INITIAL_FORM_DATA = {
    domain_type: 'subdomain',
    domain_name: '',
    tag_line: '',
    logo: null,
    banner: null,
    color_theme: 'Default',
    colors: null,
    fonts: '',
    about: '',
    profile_privacy: 'public',
    header_text: '',
    footer_text: '',
    brands: [],
    interests: [],
    contact_email: '',
    phone: '',
    address: '',
    facebook_enabled: false,
    facebook: '',
    instagram_enabled: false,
    instagram: '',
    flickr_enabled: false,
    flickr: '',
    username: '',
    email: '',
    password: '',
};

function PhotographerSignup() {
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
            payload.append('role', 'member');
            payload.append('tag_line', formData.tag_line);
            payload.append('about', formData.about);

            payload.append('member[domain_name]', formData.domain_name);
            payload.append('member[domain_type]', formData.domain_type === 'customdomain' ? 'custom' : 'subdomain');
            payload.append('member[color_theme]', formData.color_theme || '');
            payload.append('member[fonts]', formData.fonts || '');
            payload.append('member[profile_privacy]', formData.profile_privacy);
            payload.append('member[header_text]', formData.header_text);
            payload.append('member[footer_text]', formData.footer_text);

            formData.brands.forEach((brand) => payload.append('member_brands[brands][]', brand));
            formData.interests.forEach((interest) => payload.append('member_brands[interest][]', interest));

            if (formData.contact_email || formData.phone || formData.address) {
                payload.append('member_contact[email]', formData.contact_email);
                payload.append('member_contact[phone]', formData.phone);
                payload.append('member_contact[address]', formData.address);
            }

            const socials = [
                { enabled: formData.facebook_enabled, name: 'facebook', link: formData.facebook },
                { enabled: formData.instagram_enabled, name: 'instagram', link: formData.instagram },
                { enabled: formData.flickr_enabled, name: 'flickr', link: formData.flickr },
            ];
            let socialIndex = 0;
            socials.forEach(({ enabled, name, link }) => {
                if (enabled && link) {
                    payload.append(`member_social_media[${socialIndex}][social_media_name]`, name);
                    payload.append(`member_social_media[${socialIndex}][social_link]`, link);
                    socialIndex += 1;
                }
            });

            await apiClient.post('/sign-up', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/login');
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;
            if (status === 409) {
                setSubmitError(message || 'Username or email already in use.');
            } else {
                setSubmitError(message || 'Something went wrong while creating your website. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const CurrentComponent = components[currentStep];
    const bannerUrl = formData.banner instanceof File ? URL.createObjectURL(formData.banner) : sample;
    const socialLinks = [
        formData.facebook_enabled && formData.facebook && { key: 'facebook', icon: 'fa-facebook-f', href: formData.facebook },
        formData.instagram_enabled && formData.instagram && { key: 'instagram', icon: 'fa-instagram', href: formData.instagram },
        formData.flickr_enabled && formData.flickr && { key: 'flickr', icon: 'fa-flickr', href: formData.flickr },
    ].filter(Boolean);

    return (
        <div className="sp-page">
            <div className="sp-form-side">
                <div className="sp-card" style={{ maxWidth: '1000%' }}>
                    <img src={photo} alt="photo.cv" style={{ height: '36px' }} />

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

                    <div className="sp-step-header" key={`header-${currentStep}`}>
                        <h2 className="sp-title">{titles[currentStep]}</h2>
                        <p className="sp-subtitle">{subtitles[currentStep]}</p>
                    </div>

                    {submitError && <div className="sp-error">{submitError}</div>}

                    <div className="sp-step-body" key={`body-${currentStep}`}>
                        <CurrentComponent formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} onSkip={handleSkip} onSubmit={handleSubmit} submitting={submitting} />
                    </div>
                </div>
            </div>
            <div className="sp-image-side" style={{ position: 'static', display: 'block', overflowY: 'auto', padding: '32px' }}>
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '320px' }}>
                    <img src={bannerUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(200deg, rgba(43,30,25,0.1) 0%, rgba(43,30,25,0.75) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
                        <h1 style={{ color: '#fff', fontWeight: '300', fontSize: '36px', margin: '0' }}>{formData.username || 'Enter Name'}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', margin: '4px 0 16px' }}>{formData.tag_line || 'Enter Tag Line'}</p>
                        <button type="button" style={{ alignSelf: 'flex-start', background: '#fff', color: '#3a2e26', border: 'none', borderRadius: '6px', padding: '8px 18px', fontSize: '13px' }}>See More</button>
                    </div>
                </div>

                {currentStep >= 2 && (
                    <div style={{ marginTop: '28px' }}>
                        <h4 style={{ color: '#4c4036' }}>What do I like to photograph?</h4>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '12px' }}>
                            <div style={{ flex: '1', minWidth: '220px' }}>
                                <p style={{ color: '#7a6b5d', fontSize: '14px', lineHeight: '1.6' }}>{formData.about || 'Tell visitors a bit about yourself and your photography in the About field.'}</p>
                                {socialLinks.length > 0 && (
                                    <>
                                        <div style={{ color: '#cc445e', fontWeight: '600', fontSize: '13px', marginTop: '8px' }}>Follow me on social media</div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                            {socialLinks.map((s) => (
                                                <span key={s.key} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#4c4036', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className={`fa-brands ${s.icon}`} style={{ fontSize: '12px' }}></i>
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep >= 2 && (formData.brands.length > 0 || formData.interests.length > 0) && (
                    <div style={{ marginTop: '28px', background: '#4c4036', borderRadius: '10px', padding: '24px' }}>
                        <h5 style={{ color: '#fff', margin: '0' }}>Brands &amp; Interests</h5>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 16px' }}>A bit about what brands I shoot with and what genre of photography I am interested in.</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[...formData.brands, ...formData.interests].map((tag) => (
                                <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: '20px', padding: '6px 14px', fontSize: '12px' }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {currentStep >= 3 && (formData.contact_email || formData.phone || formData.address) && (
                    <div style={{ marginTop: '28px' }}>
                        <h5 style={{ color: '#4c4036' }}>My Contact</h5>
                        {formData.address && <div style={{ color: '#7a6b5d', fontSize: '13px', marginBottom: '4px' }}><i className="fa-solid fa-location-dot me-2"></i>{formData.address}</div>}
                        {formData.phone && <div style={{ color: '#7a6b5d', fontSize: '13px', marginBottom: '4px' }}><i className="fa-solid fa-phone me-2"></i>{formData.phone}</div>}
                        {formData.contact_email && <div style={{ color: '#7a6b5d', fontSize: '13px' }}><i className="fa-solid fa-envelope me-2"></i>{formData.contact_email}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};
export default PhotographerSignup;
