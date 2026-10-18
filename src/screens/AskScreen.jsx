import React, { useState } from 'react';
import { useMechLab } from '../context/MechLabContext';

const TAG_LIST = ['Robotics', 'AI', 'Embedded', 'Mechatronics', 'Drones'];

export default function AskScreen({ active }) {
  const { navTo, addCommunityQuestion, showToast } = useMechLab();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePost = () => {
    addCommunityQuestion(title.trim(), details.trim(), selectedTags);
    setTitle('');
    setDetails('');
    setSelectedTags([]);
    showToast('Question posted');
    navTo('community');
  };

  return (
    <section className={`screen${active ? ' show' : ''}`} id="ask">
      <div className="hdr">
        <a
          className="back"
          href="#community"
          aria-label="Back"
          onClick={(e) => {
            e.preventDefault();
            navTo('community');
          }}
        >
          ←
        </a>
        <h1>Ask a question</h1>
      </div>
      <label className="fl2" htmlFor="qt">
        Question title
      </label>
      <input
        className="f"
        id="qt"
        type="text"
        placeholder="What do you want to know?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="fl2" htmlFor="qd">
        Details
      </label>
      <textarea
        className="f"
        id="qd"
        rows="5"
        placeholder="Add details, code or what you have tried"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <p className="lab">Tags</p>
      <div className="chips" data-multi>
        {TAG_LIST.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className="chip"
              aria-pressed={isSelected ? 'true' : 'false'}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <button className="btn" type="button" onClick={handlePost}>
        Post question
      </button>
    </section>
  );
}
