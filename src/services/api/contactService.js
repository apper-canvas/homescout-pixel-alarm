import { toast } from 'react-toastify';

export const contactService = {
  async sendPropertyInquiry(inquiryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone || '',
          message: inquiryData.message,
          property_id: inquiryData.propertyId,
          property_title: inquiryData.propertyTitle,
          property_price: inquiryData.propertyPrice,
          inquiry_type: inquiryData.inquiryType || 'property-contact',
          timestamp: inquiryData.timestamp || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('contact_inquiry', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} contact inquiry records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error('Failed to send inquiry. Please try again.');
          }
        }
        
        if (successfulRecords.length > 0) {
          return {
            success: true,
            message: 'Your inquiry has been sent successfully. The agent will contact you within 24 hours.',
            id: successfulRecords[0].data.Id
          };
        }
      }
      
      throw new Error('Failed to send inquiry. Please try again.');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending property inquiry:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(error.message);
        throw error;
      }
    }
  },

  async sendGeneralContact(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || '',
          message: contactData.message,
          inquiry_type: 'general-contact',
          timestamp: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('contact_inquiry', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} contact records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error('Failed to send message. Please try again.');
          }
        }
        
        if (successfulRecords.length > 0) {
          return {
            success: true,
            message: 'Thank you for contacting us. We will get back to you soon.',
            id: successfulRecords[0].data.Id
          };
        }
      }
      
      throw new Error('Failed to send message. Please try again.');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending general contact:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(error.message);
        throw error;
      }
    }
  }
};