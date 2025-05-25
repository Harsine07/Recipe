import React from 'react';

const Star = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimal = rating - fullStars;
  const totalStars = 5;

  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    let fill = 0;
    if (i < fullStars) fill = 100;
    else if (i === fullStars) fill = decimal * 100;
    else fill = 0;

    stars.push(
      <svg
        key={i}
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-${i}`}>
            <stop offset={`${fill}%`} stopColor="#facc15" />
            <stop offset={`${fill}%`} stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#grad-${i})`}
          stroke="none"
          d="M12 17.27L18.18 21 16.54 13.97 
             22 9.24 14.81 8.63 12 2 9.19 8.63 
             2 9.24 7.46 13.97 5.82 21z"
        />
      </svg>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default Star;
