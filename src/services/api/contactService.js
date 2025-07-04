// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async sendPropertyInquiry(inquiryData) {
    await delay(300);
    
    // Simulate API call success/failure
    if (Math.random() > 0.1) { // 90% success rate
      return {
        success: true,
        message: 'Your inquiry has been sent successfully. The agent will contact you within 24 hours.',
        id: Date.now()
      };
    } else {
      throw new Error('Failed to send inquiry. Please try again.');
    }
  },

  async sendGeneralContact(contactData) {
    await delay(250);
    
    if (Math.random() > 0.1) { // 90% success rate
      return {
        success: true,
        message: 'Thank you for contacting us. We will get back to you soon.',
        id: Date.now()
      };
    } else {
      throw new Error('Failed to send message. Please try again.');
    }
  }
};