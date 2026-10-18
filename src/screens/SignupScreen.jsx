import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';
import { ASSETS } from '../data/brandAssets';
import { COUNTRIES, CITIES_BY_COUNTRY } from '../data/initialData';
import ComboBox from '../components/shared/ComboBox';

export default function SignupScreen({ active }) {
  const {
    navTo,
    isDark,
    toggleDarkLight,
    showToast,
    registerUser,
    loginWithOAuth
  } = useMechLab();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const cityList = country
    ? CITIES_BY_COUNTRY[country] || [
        `${country} City`,
        'Central',
        'North',
        'South',
        'East',
        'West',
        'Other'
      ]
    : [];

  const handleOAuth = async (provider) => {
    await loginWithOAuth(provider);
    navTo('dash');
  };

  const handleSignUp = async () => {
    const errs = {};
    if (!firstName.trim()) errs.fn = true;
    if (!lastName.trim()) errs.ln = true;
    if (!phoneOrEmail.trim()) errs.ph = true;
    if (!username.trim()) errs.un = true;
    if (!password.trim()) errs.pw = true;

    setInvalidFields(errs);
    const hasMissing = Object.keys(errs).length > 0;

    if (hasMissing || !termsAccepted) {
      setErrorMsg(
        hasMissing
          ? 'Please fill in the required fields (*)'
          : 'Please agree to the Terms and Conditions'
      );
      return;
    }

    const res = await registerUser({
      firstName,
      middleName,
      lastName,
      country,
      city,
      phoneOrEmail,
      fieldOfStudy,
      gender,
      dob,
      username,
      password,
      termsAccepted
    });

    if (!res.ok) {
      if (res.fieldErrors) setInvalidFields(res.fieldErrors);
      setErrorMsg(res.error || 'Registration failed');
      return;
    }

    setErrorMsg('');
    showToast('Welcome to AI Mech Lab!');
    navTo('dash');
  };

  return (
    <section className={`screen hero${active ? ' show' : ''}`} id="signup">
      <button
        className="ic thm th2"
        type="button"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleDarkLight}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className="logo">
        <img src={ASSETS.BRAND_LOGO_HERO} alt="AI Mech Lab" />
      </div>
      <h1 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>
        Create your account
      </h1>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('google')}
      >
        <svg viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"
          />
          <path
            fill="#EA4335"
            d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z"
          />
        </svg>
        Continue with Google
      </button>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('github')}
      >
        <svg viewBox="0 0 16 16" style={{ fill: 'currentColor' }}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        Continue with GitHub
      </button>
      <button
        className="btn g sc"
        type="button"
        onClick={() => handleOAuth('linkedin')}
      >
        <svg viewBox="0 0 24 24">
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M5 9h3v10H5zM6.5 4.6a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h2.9v1.4c.5-.9 1.6-1.6 3.1-1.6 3 0 3.6 2 3.6 4.6V19h-3v-4.7c0-1.2-.4-2.1-1.6-2.1-1.3 0-1.9.9-1.9 2.2V19H10z"
          />
        </svg>
        Continue with LinkedIn
      </button>
      <div className="or">
        <span>or sign up with your details</span>
      </div>
      <div style={{ textAlign: 'left' }}>
        <label className="fl2" htmlFor="fn">
          First name <em>*</em>
        </label>
        <input
          className={`f${invalidFields.fn ? ' bad' : ''}`}
          id="fn"
          data-req
          type="text"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setInvalidFields((p) => ({ ...p, fn: false }));
          }}
        />
        <label className="fl2" htmlFor="mn">
          Middle name <span>(optional)</span>
        </label>
        <input
          className="f"
          id="mn"
          type="text"
          autoComplete="additional-name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />
        <label className="fl2" htmlFor="ln">
          Last name <em>*</em>
        </label>
        <input
          className={`f${invalidFields.ln ? ' bad' : ''}`}
          id="ln"
          data-req
          type="text"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setInvalidFields((p) => ({ ...p, ln: false }));
          }}
        />
        <label className="fl2">Country</label>
        <ComboBox
          id="cc"
          placeholder="Select country"
          searchPlaceholder="Search country"
          items={COUNTRIES}
          value={country}
          onPick={(c) => {
            setCountry(c);
            setCity('');
          }}
        />
        <label className="fl2">City</label>
        <ComboBox
          id="cy"
          placeholder={country ? 'Select city' : 'Select country first'}
          searchPlaceholder="Search city"
          items={cityList}
          value={city}
          disabled={!country}
          free={true}
          onPick={(ct) => setCity(ct)}
        />
        <label className="fl2" htmlFor="ph">
          Phone number or email <em>*</em>
        </label>
        <input
          className={`f${invalidFields.ph ? ' bad' : ''}`}
          id="ph"
          data-req
          type="text"
          autoComplete="off"
          value={phoneOrEmail}
          onChange={(e) => {
            setPhoneOrEmail(e.target.value);
            setInvalidFields((p) => ({ ...p, ph: false }));
          }}
        />
        <label className="fl2" htmlFor="fs">
          Occupation or field of study
        </label>
        <select
          className="f"
          id="fs"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        >
          <option value="">Select a field</option>
          <option>Artificial Intelligence</option>
          <option>Robotics</option>
          <option>Mechatronics</option>
        </select>
        <label className="fl2" htmlFor="gd">
          Gender
        </label>
        <select
          className="f"
          id="gd"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Prefer not to say</option>
        </select>
        <label className="fl2" htmlFor="db">
          Date of birth
        </label>
        <input
          className="f"
          id="db"
          type="date"
          max="2026-10-06"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label className="fl2" htmlFor="un">
          Username <em>*</em>
        </label>
        <input
          className={`f${invalidFields.un ? ' bad' : ''}`}
          id="un"
          data-req
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setInvalidFields((p) => ({ ...p, un: false }));
          }}
        />
        <label className="fl2" htmlFor="pw">
          Password <em>*</em>
        </label>
        <input
          className={`f${invalidFields.pw ? ' bad' : ''}`}
          id="pw"
          data-req
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setInvalidFields((p) => ({ ...p, pw: false }));
          }}
        />
        <label className="tc">
          <input
            type="checkbox"
            id="tc"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I agree to the{' '}
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                navTo('terms');
              }}
            >
              Terms and Conditions
            </a>
          </span>
        </label>
      </div>
      <p className="msg" id="sm" role="alert">
        {errorMsg}
      </p>
      <button className="btn" id="su" type="button" onClick={handleSignUp}>
        Sign up
      </button>
      <p className="sub" style={{ marginTop: '14px' }}>
        Already have an account?{' '}
        <a
          href="#auth"
          style={{ color: 'var(--blue)', fontWeight: 700 }}
          onClick={(e) => {
            e.preventDefault();
            navTo('auth');
          }}
        >
          Log in
        </a>
      </p>
    </section>
  );
}
