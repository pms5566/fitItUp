/* ============================================================
   FIT IT UP — CMS Store (Data Layer)
   js/cms-store.js
   Shared reactive storage for FitItUp Admin CMS and Landing Page
   ============================================================ */

(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    SETTINGS: 'fititup_settings',
    LEADS: 'fititup_leads',
    PROGRAMS: 'fititup_programs',
    TESTIMONIALS: 'fititup_testimonials',
    FAQS: 'fititup_faqs',
    SLOTS: 'fititup_slots',
    STUDIO: 'fititup_studio'
  };

  // ── Default State ─────────────────────────────────────────────
  const DEFAULT_STUDIO = {
    hourlyRate: '599',
    hourlyUnit: 'Per Hour / Solo or Client',
    creatorRate: '1,999',
    creatorUnit: '4-Hour Shoot Session',
    trainerRate: '7,999',
    trainerUnit: '20 Hours / Month',
    description: 'Fully equipped, private, and air-conditioned fitness studio. Perfect for personal trainers, yoga & calisthenics coaches, and fitness content creators.',
    equipmentNotes: 'Includes continuous softbox lighting, wireless mics, private changing room & full dumbbell rack.',
    amenities: [
      { id: 'a1', name: '100% Private Access (Exclusive Slot, Zero Crowds)', icon: '🔒', active: true },
      { id: 'a2', name: 'Full Squat Rack, Barbells & Dumbbell Set', icon: '🏋️', active: true },
      { id: 'a3', name: 'Continuous Softbox & Ring Lights (Shoots Ready)', icon: '🎬', active: true },
      { id: 'a4', name: 'Dual Wireless Lapel Mics (Type-C / Lightning)', icon: '🎙️', active: true },
      { id: 'a5', name: 'Air Conditioned + Bluetooth Sound & Mirrors', icon: '❄️', active: true },
      { id: 'a6', name: 'Private Changing Room + Fast Wi-Fi', icon: '🚿', active: true }
    ],
    blackoutDates: ''
  };
  const DEFAULT_SETTINGS = {
    coachName: 'Ashish Satarkar',
    brandName: 'Fit It Up',
    whatsappPhone: '919999999999',
    supportEmail: 'ashish@fititup.in',
    instagramUrl: 'https://instagram.com/fititup07',
    youtubeUrl: 'https://youtube.com/@fititup07',
    tagline: 'Train Smart. Live Fit.',
    hindiTagline: 'अपने आप को बेहतर बनाओ, आज से शुरुआत करें।',
    yearsExperience: '5+',
    activeMembers: '500+'
  };

  const DEFAULT_PROGRAMS = [
    {
      id: 'starter',
      name: 'Starter',
      badge: '',
      description: 'Perfect for beginners ready to build healthy habits.',
      price: '2,999',
      period: '/ month',
      features: [
        '2 Sessions per week',
        'Basic diet plan included',
        'WhatsApp check-in (weekly)',
        'Progress tracking'
      ],
      featured: false
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: '🔥 Most Popular',
      description: 'For serious trainees ready for full transformation.',
      price: '5,999',
      period: '/ month',
      features: [
        '4 Sessions per week',
        'Full nutrition + meal plan',
        'Daily WhatsApp support',
        'Progress photos + monthly review',
        'Goal-oriented training plan'
      ],
      featured: true
    },
    {
      id: 'elite',
      name: 'Elite',
      badge: '⭐ VIP Coaching',
      description: 'Maximum results. Unlimited access to Ashish.',
      price: '9,999',
      period: '/ month',
      features: [
        'Unlimited sessions',
        'Full nutrition & lifestyle coaching',
        '24/7 WhatsApp support',
        'Personalised performance programs',
        'Weekly video calls + strategy sessions'
      ],
      featured: false
    }
  ];

  const DEFAULT_TESTIMONIALS = [
    {
      id: 't1',
      name: 'Rahul Sharma',
      initial: 'R',
      tag: 'Lost 12 kg in 3 months · Mumbai',
      stars: 5,
      quote: 'Ashish completely changed how I look at fitness. In just 3 months I lost 12 kg and feel stronger than ever. His WhatsApp support kept me on track every single day.'
    },
    {
      id: 't2',
      name: 'Priya Desai',
      initial: 'P',
      tag: 'Muscle Gain · Pune',
      stars: 5,
      quote: 'I tried many online trainers before Ashish. He is the only one who actually understood my body type and gave me a realistic Indian diet plan. I gained 8 kg of muscle!'
    },
    {
      id: 't3',
      name: 'Anjali Mehta',
      initial: 'A',
      tag: 'Kids Program · Nashik',
      stars: 5,
      quote: 'My 10-year-old son loves his kids fitness sessions with Ashish. He\'s more active, more confident, and actually looks forward to working out now. Best decision we made.'
    }
  ];

  const DEFAULT_FAQS = [
    {
      id: 'faq1',
      question: 'Is there a lock-in period?',
      answer: 'No, there is absolutely no lock-in period. You pay on a monthly subscription basis and can cancel anytime after your current month expires.'
    },
    {
      id: 'faq2',
      question: 'Do I need gym equipment?',
      answer: 'No gym equipment is required. All programs can be adapted entirely to home environments using bodyweight and minimal items like resistance bands.'
    },
    {
      id: 'faq3',
      question: 'How do I receive my plan?',
      answer: 'You will receive your customized diet and workout charts via WhatsApp and as a PDF document within 48 hours of completing your onboarding consultation.'
    },
    {
      id: 'faq4',
      question: 'Is vegetarian / Jain food supported?',
      answer: 'Yes, 100%! All diet plans are built around authentic Indian home-cooked meals including vegetarian, eggetarian, Jain, and non-vegetarian preferences.'
    }
  ];

  const DEFAULT_SLOTS = [
    { time: '10:00 AM', active: true },
    { time: '11:30 AM', active: true },
    { time: '02:00 PM', active: true },
    { time: '04:30 PM', active: true },
    { time: '06:00 PM', active: true },
    { time: '07:00 PM', active: true }
  ];

  const DEFAULT_LEADS = [
    {
      id: 'lead-sample-1',
      name: 'Vikram Singh',
      phone: '9876543210',
      email: 'vikram.singh@gmail.com',
      goal: 'Fat Loss',
      slot: '11:30 AM',
      message: 'Looking for 12-week transformation plan with vegetarian diet.',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'lead-sample-2',
      name: 'Simran Kaur',
      phone: '9812345678',
      email: 'simran.k@yahoo.com',
      goal: 'General Fitness',
      slot: '06:00 PM',
      message: 'Need home workout guidance without dumbbells.',
      status: 'Contacted',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'lead-sample-3',
      name: 'Karan Patel',
      phone: '9823456789',
      email: 'karan.shoots@gmail.com',
      goal: 'Studio Rental / Shoot',
      slot: '02:00 PM',
      message: 'Need 4-hour creator shoot slot for fitness reels with studio lighting and barbells.',
      source: 'Instagram DM',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];

  // Helper read/write
  function get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch(e) {
      console.warn('CMS Store read error', e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent('fititup_cms_update', { detail: { key, value } }));
    } catch(e) {
      console.error('CMS Store write error', e);
    }
  }

  // ── Public Store API ──────────────────────────────────────────
  const cmsStore = {
    // Settings
    getSettings() {
      return get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    updateSettings(data) {
      const current = this.getSettings();
      const updated = { ...current, ...data };
      set(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    // Leads
    getLeads() {
      return get(STORAGE_KEYS.LEADS, DEFAULT_LEADS);
    },
    addLead(lead) {
      const leads = this.getLeads();
      const newLead = {
        id: 'lead-' + Date.now(),
        status: 'New',
        createdAt: new Date().toISOString(),
        ...lead
      };
      leads.unshift(newLead);
      set(STORAGE_KEYS.LEADS, leads);
      return newLead;
    },
    updateLeadStatus(id, status) {
      const leads = this.getLeads().map(lead => lead.id === id ? { ...lead, status } : lead);
      set(STORAGE_KEYS.LEADS, leads);
      return leads;
    },
    deleteLead(id) {
      const leads = this.getLeads().filter(lead => lead.id !== id);
      set(STORAGE_KEYS.LEADS, leads);
      return leads;
    },

    // Programs
    getPrograms() {
      return get(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
    },
    updateProgram(id, data) {
      const programs = this.getPrograms().map(p => p.id === id ? { ...p, ...data } : p);
      set(STORAGE_KEYS.PROGRAMS, programs);
      return programs;
    },

    // Testimonials
    getTestimonials() {
      return get(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
    },
    addTestimonial(item) {
      const items = this.getTestimonials();
      const newItem = {
        id: 't-' + Date.now(),
        initial: item.name ? item.name.charAt(0).toUpperCase() : 'C',
        stars: 5,
        ...item
      };
      items.unshift(newItem);
      set(STORAGE_KEYS.TESTIMONIALS, items);
      return newItem;
    },
    deleteTestimonial(id) {
      const items = this.getTestimonials().filter(t => t.id !== id);
      set(STORAGE_KEYS.TESTIMONIALS, items);
      return items;
    },

    // FAQs
    getFaqs() {
      return get(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
    },
    addFaq(item) {
      const faqs = this.getFaqs();
      const newFaq = {
        id: 'faq-' + Date.now(),
        ...item
      };
      faqs.push(newFaq);
      set(STORAGE_KEYS.FAQS, faqs);
      return newFaq;
    },
    deleteFaq(id) {
      const faqs = this.getFaqs().filter(f => f.id !== id);
      set(STORAGE_KEYS.FAQS, faqs);
      return faqs;
    },

    // Slots
    getSlots() {
      return get(STORAGE_KEYS.SLOTS, DEFAULT_SLOTS);
    },
    toggleSlot(time, active) {
      const slots = this.getSlots().map(s => s.time === time ? { ...s, active } : s);
      set(STORAGE_KEYS.SLOTS, slots);
      return slots;
    },

    // Studio Rental
    getStudio() {
      return get(STORAGE_KEYS.STUDIO, DEFAULT_STUDIO);
    },
    updateStudio(data) {
      const current = this.getStudio();
      const updated = { ...current, ...data };
      set(STORAGE_KEYS.STUDIO, updated);
      return updated;
    },
    toggleStudioAmenity(id, active) {
      const studio = this.getStudio();
      const amenities = (studio.amenities || []).map(a => a.id === id ? { ...a, active } : a);
      return this.updateStudio({ amenities });
    },
    addStudioAmenity(item) {
      const studio = this.getStudio();
      const amenities = studio.amenities || [];
      const newAmenity = {
        id: 'a-' + Date.now(),
        icon: item.icon || '✨',
        name: item.name || 'Studio Feature',
        active: true
      };
      amenities.push(newAmenity);
      return this.updateStudio({ amenities });
    },
    deleteStudioAmenity(id) {
      const studio = this.getStudio();
      const amenities = (studio.amenities || []).filter(a => a.id !== id);
      return this.updateStudio({ amenities });
    },
    getStudioLeads() {
      const leads = this.getLeads();
      return leads.filter(l => {
        const text = `${l.goal || ''} ${l.message || ''}`.toLowerCase();
        return text.includes('studio') || text.includes('shoot') || text.includes('rent');
      });
    },

    // Backup / Restore
    exportBackup() {
      return {
        settings: this.getSettings(),
        leads: this.getLeads(),
        programs: this.getPrograms(),
        testimonials: this.getTestimonials(),
        faqs: this.getFaqs(),
        slots: this.getSlots(),
        studio: this.getStudio(),
        exportedAt: new Date().toISOString()
      };
    },
    restoreBackup(data) {
      if (!data) return false;
      if (data.settings) set(STORAGE_KEYS.SETTINGS, data.settings);
      if (data.leads) set(STORAGE_KEYS.LEADS, data.leads);
      if (data.programs) set(STORAGE_KEYS.PROGRAMS, data.programs);
      if (data.testimonials) set(STORAGE_KEYS.TESTIMONIALS, data.testimonials);
      if (data.faqs) set(STORAGE_KEYS.FAQS, data.faqs);
      if (data.slots) set(STORAGE_KEYS.SLOTS, data.slots);
      if (data.studio) set(STORAGE_KEYS.STUDIO, data.studio);
      return true;
    },
    resetDefaults() {
      set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      set(STORAGE_KEYS.LEADS, DEFAULT_LEADS);
      set(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
      set(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
      set(STORAGE_KEYS.FAQS, DEFAULT_FAQS);
      set(STORAGE_KEYS.SLOTS, DEFAULT_SLOTS);
      set(STORAGE_KEYS.STUDIO, DEFAULT_STUDIO);
    }
  };

  // Expose globally
  window.FitItUpCMS = cmsStore;

})(window);
