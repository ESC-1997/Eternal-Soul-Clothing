'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Navigation from "../components/Navigation";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('name');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [modalPage, setModalPage] = useState(1);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sections = useRef<{ [key: string]: IntersectionObserverEntry }>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shirtSize, setShirtSize] = useState('m');
  const [saveStatus, setSaveStatus] = useState<{[key: string]: string}>({});

  // Track shipping address input
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  // Track payment card input
  const [hasPaymentCard, setHasPaymentCard] = useState(false);

  // Add window resize listener
  const [isMobile, setIsMobile] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('profileData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setEmailNotifications(data.emailNotifications || false);
        setSmsNotifications(data.smsNotifications || false);
        setShirtSize(data.shirtSize || 'm');
        setShippingAddress(data.shippingAddress || {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: ''
        });
        
        // Validate loaded data
        if (data.email) setIsEmailValid(validateEmail(data.email));
        if (data.phoneNumber) setIsPhoneValid(data.phoneNumber.replace(/\D/g, '').length === 10);
      }
    }
  }, []);

  // Update window resize listener to handle both portrait and landscape
  useEffect(() => {
    const checkMobile = () => {
      // Check if either width or height is below tablet breakpoint
      const isMobileSize = window.innerWidth < 640 || window.innerHeight < 640;
      setIsMobile(isMobileSize);
    };

    // Check initially
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save section data
  const saveSection = (section: string) => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      emailNotifications,
      smsNotifications,
      shirtSize,
      shippingAddress
    };
    
    localStorage.setItem('profileData', JSON.stringify(profileData));
    
    // Show save status
    setSaveStatus(prev => ({
      ...prev,
      [section]: 'Saved!'
    }));
    
    // Clear save status after 2 seconds
    setTimeout(() => {
      setSaveStatus(prev => ({
        ...prev,
        [section]: ''
      }));
    }, 2000);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format the number based on length
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)})${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)})${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
    // Check if the number is complete (10 digits)
    const numbers = formattedNumber.replace(/\D/g, '');
    setIsPhoneValid(numbers.length === 10);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sections.current[entry.target.id] = entry;
        });

        // Find the section that's most visible
        let mostVisibleSection = null;
        let highestRatio = 0;

        Object.entries(sections.current).forEach(([id, entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            mostVisibleSection = id;
          }
        });

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px -50% 0px'
      }
    );

    // Observe all sections
    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    // Check if any profile completion criteria are met
    const isProfileComplete = 
      email !== '' || 
      phoneNumber !== '' || 
      Object.values(shippingAddress).some(value => value !== '') ||
      hasPaymentCard;

    if (isProfileComplete) {
      setHasCompletedProfile(true);
      setShowModal(false);
    }
  }, [email, phoneNumber, shippingAddress, hasPaymentCard]);

  // Update shipping address handler
  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update payment card handler
  const handlePaymentCardAdded = () => {
    setHasPaymentCard(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Navigation />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isMenuOpen ? 'ml-20' : 'ml-0 sm:ml-20'
      }`}>
        <div className={`min-h-screen bg-white ${showModal ? 'blur-sm' : ''} overflow-y-auto`}>
          {/* Sub Navigation */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pl-16 sm:pl-0 justify-end sm:justify-start">
                <button
                  onClick={() => scrollToSection('name')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeSection === 'name' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Name
                </button>
                <button
                  onClick={() => scrollToSection('preferences')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeSection === 'preferences' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Preferences
                </button>
                <button
                  onClick={() => scrollToSection('shipping')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeSection === 'shipping' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Shipping
                </button>
                <button
                  onClick={() => scrollToSection('payment')}
                  className={`px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap ${
                    activeSection === 'payment' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Payment
                </button>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8 pb-20">
            {/* Name Section */}
            <section id="name" className="mb-8 sm:mb-16">
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-black">Name</h2>
                  <Image
                    src="/images/ID.png"
                    alt="ID"
                    width={24}
                    height={24}
                    className=""
                    priority
                  />
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus.name && (
                    <span className="text-green-500 text-sm animate-fade-out">{saveStatus.name}</span>
                  )}
                  <button
                    onClick={() => saveSection('name')}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
            </section>

            {/* Preferences Section */}
            <section id="preferences" className="mb-8 sm:mb-16">
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-black">Preferences</h2>
                  <Image
                    src="/images/Preferences.png"
                    alt="Preferences"
                    width={24}
                    height={24}
                    className=""
                    priority
                  />
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus.preferences && (
                    <span className="text-green-500 text-sm animate-fade-out">{saveStatus.preferences}</span>
                  )}
                  <button
                    onClick={() => saveSection('preferences')}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 rounded-lg">
                  <span className="text-sm sm:text-base text-black">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                {emailNotifications && (
                  <div className="pl-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={handleEmailChange}
                          className={`w-full p-2 sm:p-3 rounded-lg border text-black transition-all duration-300 text-sm sm:text-base ${
                            isEmailValid 
                              ? 'bg-white border-green-500 focus:border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]' 
                              : 'bg-gray-100 border-gray-200 focus:border-black'
                          }`}
                        />
                        {isEmailValid && (
                          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {email && !isEmailValid && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">Please enter a valid email address</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 rounded-lg">
                  <span className="text-sm sm:text-base text-black">SMS Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                    />
                    <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                {smsNotifications && (
                  <div className="pl-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          placeholder="(000)000-0000"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          maxLength={14}
                          pattern="\(\d{3}\)\d{3}-\d{4}"
                          className={`w-full p-2 sm:p-3 rounded-lg border text-black transition-all duration-300 text-sm sm:text-base ${
                            isPhoneValid 
                              ? 'bg-white border-green-500 focus:border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]' 
                              : 'bg-gray-100 border-gray-200 focus:border-black'
                          }`}
                        />
                        {isPhoneValid && (
                          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {phoneNumber && !isPhoneValid && (
                      <p className="text-xs sm:text-sm text-red-500 mt-1">Please enter a complete phone number</p>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 rounded-lg">
                  <span className="text-sm sm:text-base text-black">Shirt Size</span>
                  <select 
                    className="bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-black focus:outline-none focus:border-black text-sm sm:text-base"
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                  >
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                    <option value="3xl">3XL</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Shipping Address Section */}
            <section id="shipping" className="mb-8 sm:mb-16">
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-black">Shipping Address</h2>
                  <Image
                    src="/images/Shipping.png"
                    alt="Shipping"
                    width={24}
                    height={24}
                    className=""
                    priority
                  />
                </div>
                <div className="flex items-center gap-2">
                  {saveStatus.shipping && (
                    <span className="text-green-500 text-sm animate-fade-out">{saveStatus.shipping}</span>
                  )}
                  <button
                    onClick={() => saveSection('shipping')}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => handleShippingAddressChange('street', e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={shippingAddress.zip}
                    onChange={(e) => handleShippingAddressChange('zip', e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={shippingAddress.country}
                    onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                    className="w-full p-2 sm:p-3 rounded-lg bg-gray-100 border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:border-black transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>
            </section>

            {/* Payment Methods Section */}
            <section id="payment" className="mb-8 sm:mb-16">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-black">Payment Methods</h2>
                <Image
                  src="/images/Credit_Card.png"
                  alt="Credit Card"
                  width={24}
                  height={24}
                  className=""
                  priority
                />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-sm sm:text-base text-black font-medium">Credit Card</span>
                    <button className="text-sm sm:text-base text-black hover:text-gray-600" suppressHydrationWarning>Edit</button>
                  </div>
                  <div className="text-sm sm:text-base text-black">•••• •••• •••• 1234</div>
                </div>
                <button 
                  onClick={handlePaymentCardAdded}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base" 
                  suppressHydrationWarning
                >
                  Add Payment Method
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Desktop Modal */}
        {showModal && !isMobile && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            ></div>
            <div className="relative w-full max-w-[95vw] sm:max-w-5xl bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="relative w-full" style={{ paddingBottom: '40%' }}>
                <img
                  src={modalPage === 1 ? "/images/Preferences_Modal.svg" : "/images/Shipping_Modal.svg"}
                  alt={modalPage === 1 ? "Preferences Modal" : "Shipping Modal"}
                  className="absolute inset-0 w-full h-full"
                  key={modalPage}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${modalPage === 1 ? 'bg-black' : 'bg-gray-300'}`}
                    ></div>
                    <div 
                      className={`w-2 h-2 rounded-full ${modalPage === 2 ? 'bg-black' : 'bg-gray-300'}`}
                    ></div>
                  </div>
                  <button
                    onClick={() => {
                      if (modalPage === 1) {
                        setModalPage(2);
                      } else {
                        setShowModal(false);
                      }
                    }}
                    className="px-6 py-3 bg-[#9333EA] text-white rounded-lg font-medium hover:bg-[#6B21A8] transition-colors"
                  >
                    {modalPage === 1 ? 'Next' : 'Got it'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Modal */}
        {showModal && isMobile && (
          <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto">
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            ></div>
            <div className="relative w-[90%] h-[70vh] max-w-sm mx-auto my-auto bg-white rounded-lg overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={modalPage === 1 ? "/images/Mobile_Modal1.svg" : "/images/Mobile_Modal2.svg"}
                  alt={modalPage === 1 ? "Mobile Preferences Modal" : "Mobile Shipping Modal"}
                  className="w-full h-full object-contain"
                  key={modalPage}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <div 
                      className={`w-1 h-1 rounded-full ${modalPage === 1 ? 'bg-white' : 'bg-white/50'}`}
                    ></div>
                    <div 
                      className={`w-1 h-1 rounded-full ${modalPage === 2 ? 'bg-white' : 'bg-white/50'}`}
                    ></div>
                  </div>
                  <button
                    onClick={() => {
                      if (modalPage === 1) {
                        setModalPage(2);
                      } else {
                        setShowModal(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#9333EA] text-white rounded-lg font-medium hover:bg-[#6B21A8] transition-colors text-sm"
                  >
                    {modalPage === 1 ? 'Next' : 'Got it'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
