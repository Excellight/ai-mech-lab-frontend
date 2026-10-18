import React, { useState, useRef, useEffect } from 'react';

export default function ComboBox({
  id,
  placeholder = 'Select',
  searchPlaceholder = 'Search',
  items = [],
  value = '',
  disabled = false,
  free = false,
  onPick,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const s = query.trim().toLowerCase();
  const filtered = items
    .filter((item) => item.toLowerCase().includes(s))
    .slice(0, 250);

  const listToRender =
    filtered.length > 0
      ? filtered
      : s && free
      ? [query.trim()]
      : [];

  const toggleOpen = (e) => {
    e.stopPropagation();
    if (disabled) return;
    const next = !open;
    setOpen(next);
    if (next) {
      setQuery('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 10);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`cb2${disabled ? ' dis' : ''}${value ? ' has' : ''}${
        open ? ' open' : ''
      }`}
      id={id}
      data-v={value || undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" className="f sel" onClick={toggleOpen}>
        {value || placeholder}
      </button>
      <div className="pl">
        <input
          ref={inputRef}
          className="f"
          type="text"
          placeholder={searchPlaceholder}
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul>
          {listToRender.map((item) => (
            <li
              key={item}
              onClick={() => {
                setOpen(false);
                if (onPick) onPick(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
