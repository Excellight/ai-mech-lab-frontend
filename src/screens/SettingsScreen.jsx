import React from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function SettingsScreen({ active }) {
  const {
    navTo,
    lessonReminders,
    setLessonReminders,
    soundEffects,
    setSoundEffects,
    selectedLanguage,
  } = useMechLab();

  return (
    <section className={`screen${active ? ' show' : ''}`} id="settings">
      <div className="hdr">
        <a
          className="back"
          href="#dash"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('dash');
          }}
        >
          ←
        </a>
        <h1>Settings</h1>
      </div>
      <div className="card">
        <a
          className="set"
          href="#profile"
          style={{ border: 0 }}
          onClick={(e) => {
            e.preventDefault();
            navTo('profile');
          }}
        >
          Account <span>Mech Learner ›</span>
        </a>
        <a
          className="set"
          href="#notifications"
          onClick={(e) => {
            e.preventDefault();
            navTo('notifications');
          }}
        >
          Notifications <span>›</span>
        </a>
        <a
          className="set"
          href="#appearance"
          onClick={(e) => {
            e.preventDefault();
            navTo('appearance');
          }}
        >
          Appearance <span>›</span>
        </a>
        <div className="set">
          Lesson reminders{' '}
          <button
            className="sw"
            type="button"
            role="switch"
            aria-checked={lessonReminders ? 'true' : 'false'}
            aria-label="Lesson reminders"
            onClick={() => setLessonReminders((v) => !v)}
          />
        </div>
        <div className="set">
          Sound effects{' '}
          <button
            className="sw"
            type="button"
            role="switch"
            aria-checked={soundEffects ? 'true' : 'false'}
            aria-label="Sound effects"
            onClick={() => setSoundEffects((v) => !v)}
          />
        </div>
        <a
          className="set"
          href="#language"
          onClick={(e) => {
            e.preventDefault();
            navTo('language');
          }}
        >
          Language <span>{selectedLanguage} ›</span>
        </a>
        <a
          className="set"
          href="#help"
          onClick={(e) => {
            e.preventDefault();
            navTo('help');
          }}
        >
          Help and support <span>›</span>
        </a>
        <a
          className="set"
          href="#terms"
          onClick={(e) => {
            e.preventDefault();
            navTo('terms');
          }}
        >
          About and terms <span>›</span>
        </a>
      </div>
      <a
        className="btn g"
        href="#auth"
        onClick={(e) => {
          e.preventDefault();
          navTo('auth');
        }}
      >
        Log out
      </a>
    </section>
  );
}
