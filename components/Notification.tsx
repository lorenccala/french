import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'; // Using solid for more impact

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Call onClose after fade out animation completes
        setTimeout(onClose, 300); 
      }, 2700); // Message visible for 2.7s, then fades for 0.3s

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  let bgColor = 'bg-sky-500';
  let textColor = 'text-white';
  let IconComponent = InformationCircleIcon;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-500';
      IconComponent = ExclamationCircleIcon;
      break;
    // info is default
  }

  return (
    <div 
      className={`fixed top-5 right-5 md:top-8 md:right-8 p-4 rounded-lg shadow-xl z-50 flex items-center
                  ${bgColor} ${textColor} 
                  transition-all duration-300 ease-in-out
                  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
      role="alert"
      aria-live="assertive"
    >
      <IconComponent className="w-6 h-6 mr-3 flex-shrink-0" />
      <span className="flex-grow">{message}</span>
      <button 
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} 
        className={`ml-4 p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50`}
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Notification;