import React, { useState } from 'react';
// Using custom icons instead of lucide-react

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 relative shadow-sm">
      <div className="container mx-auto flex items-center justify-center">
        <a 
          href="https://behavehealth.com/blog/narr-and-behave-health-strategic-alliance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium hover:underline transition-colors"
        >
          <img src="/images/icons/star.png" alt="Announcement" className="h-4 w-4" />
          <span>NARR & Behave Health Announce a Strategic Alliance (click to learn more)</span>
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-green-700 rounded transition-colors"
          aria-label="Close announcement"
        >
          <img src="/images/icons/close.png" alt="Close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;