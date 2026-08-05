import apiClient from '@/api/axios';
import { defineStore } from 'pinia';

export const useClubFormStore = defineStore('clubForm', {
    state: () => ({
        step1: {
            club_name: '',
            tag_line: '',
            about_title: '',
            contact_details: '',
            domain_type: '',
            domain_name: '',
            time_zone: '',
            privacy: '',
            season_name: '',
            status: '',
            start_date: '',
            end_date: '',
        },
        step2: {
            header_text: '',
            footer_text: '',
            footer_img: '',
            logo: '',
            cover_image: '',
            header_desc: '',
            footer_desc: '',
            header_img: '',
        },
        step3: {
            registration: '',
            directory_visibility: '',
            comments: '',
            likes: '',
        },
        step4: {
            news: '',
            events: '',
            galleries: '',
            competitions: '',
            home_page_blocks: '',
            reminders: '',
            fb_link: '',
            insta_link: '',
            flickr_link: '',
        },
        step5: {
            gdpr_privacy_policy_management: '',
            cookies: '',
            cookies_description: '',
            data_collection_preferences: '',
            data_collection_preferences_description: '',
            allow_reporting: '',
            allow_reporting_description: '',
        },
    }),
    actions: {
        async submitForm() {
            const payload = {
                ...this.step1,
                ...this.step2,
                ...this.step3,
                ...this.step4,
                ...this.step5,
            };

            try {
                const res = await apiClient.post('/api/submit-club', payload);
                return res.data;
            } catch (err) {
                console.error('Form submission failed:', err);
                throw err;
            }
        }
    }
});
