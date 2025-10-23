import { useState } from 'react';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const submitContactForm = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      
      const response = await fetch('/api/contact/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitStatus('error');
        return { success: false, error: data };
      }

      setSubmitStatus('success');
      return { success: true, data };

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitStatus,
    submitContactForm,
    setSubmitStatus
  };
};
