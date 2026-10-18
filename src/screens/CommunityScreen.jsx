import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';

export default function CommunityScreen({ active }) {
  const { navTo, communityPosts } = useMechLab();
  const [filter, setFilter] = useState('all');

  const visiblePosts = communityPosts.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <section className={`screen${active ? ' show' : ''}`} id="community">
      <div className="hdr">
        <h1>Community</h1>
      </div>
      <div className="chips">
        <button
          className="chip"
          type="button"
          data-f="all"
          aria-pressed={filter === 'all' ? 'true' : 'false'}
          onClick={() => setFilter('all')}
        >
          Feed
        </button>
        <button
          className="chip"
          type="button"
          data-f="q"
          aria-pressed={filter === 'q' ? 'true' : 'false'}
          onClick={() => setFilter('q')}
        >
          Questions
        </button>
        <button
          className="chip"
          type="button"
          data-f="s"
          aria-pressed={filter === 's' ? 'true' : 'false'}
          onClick={() => setFilter('s')}
        >
          Showcase
        </button>
      </div>
      <div className="card">
        {visiblePosts.map((post) => (
          <div className="post" data-c={post.category} key={post.id}>
            <div className="ph">
              <div className="av2">{post.avatar}</div>
              <div>
                <b>{post.author}</b>
                <br />
                <small className="meta">{post.time}</small>
              </div>
            </div>
            <p>{post.text}</p>
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
            <div className="pm">{post.meta}</div>
          </div>
        ))}
      </div>
      <button className="btn" type="button" onClick={() => navTo('ask')}>
        Ask a question
      </button>
    </section>
  );
}
