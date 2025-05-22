import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const SaveConfirmation: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-neutral-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center animate-in fade-in slide-in-from-bottom-5">
      <CheckCircle className="text-secondary mr-2 h-5 w-5" />
      <span>Progress saved successfully</span>
    </div>
  );
};

export default SaveConfirmation;
