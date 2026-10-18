import React from 'react';
import MechTrackMap from '../components/shared/MechTrackMap';

export default function ProjectTrackScreen({ active }) {
  return (
    <section className={`screen${active ? ' show' : ''}`} id="project">
      <MechTrackMap kind="project" />
    </section>
  );
}
