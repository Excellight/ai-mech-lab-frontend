import React from 'react';
import MechTrackMap from '../components/shared/MechTrackMap';

export default function CourseTrackScreen({ active }) {
  return (
    <section className={`screen${active ? ' show' : ''}`} id="course">
      <MechTrackMap kind="course" />
    </section>
  );
}
