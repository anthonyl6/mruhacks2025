import { useState } from 'react';
import { Popup } from './PopUp';  // Adjust path if needed

// Custom hook for handling send/request popups
export const useResponsePopup = (email: string) => {
  const [popupType, setPopupType] = useState<'send' | 'request' | null>(null);

  // Function to open Send popup
  const openSendPopup = () => {
    if (!email) return;  // Prevent open if no email
    setPopupType('send');
  };

  // Function to open Request popup
  const openRequestPopup = () => {
    if (!email) return;  // Prevent open if no email
    setPopupType('request');
  };

  // Close any popup
  const closePopup = () => setPopupType(null);

  // Conditional Popup component
  const ResponsePopup = () => {
    if (!popupType) return null;

    return (
      <Popup 
        visible={true} 
        onClose={closePopup} 
        type={popupType}
        email={email}
      />
    );
  };

  return { openSendPopup, openRequestPopup, closePopup, ResponsePopup };
};
