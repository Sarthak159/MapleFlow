// AnimatedPage.js - Component for smooth page transitions
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnimatedPage = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const location = useLocation();

  useEffect(() => {
    // Start animation out
    setIsAnimating(true);
    
    // After animation completes, update content and animate in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsAnimating(false);
    }, 300); // Half of the total animation duration

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div 
      className={`animated-page ${isAnimating ? 'animating-out' : 'animating-in'}`}
    >
      {displayChildren}
    </div>
  );
};

export default AnimatedPage;
