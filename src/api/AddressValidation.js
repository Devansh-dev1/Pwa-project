import axiosInstance from './index.js';
import axios from 'axios';
import { URL } from './index.js';

// Address validation API endpoints
const ADDRESS_VALIDATION_ENDPOINTS = {
  OPENAI_HANDLER: 'https://h6wdfhaz34.execute-api.us-east-1.amazonaws.com/dev/OpenAIHandler',
  OPENAI_HANDLER_3: 'https://h6wdfhaz34.execute-api.us-east-1.amazonaws.com/dev/OpenAIHandler3',
  CANADA_ADDRESS: 'https://h6wdfhaz34.execute-api.us-east-1.amazonaws.com/dev/getCanadaAddress'
};

/**
 * Get address suggestions from search-address API
 * @param {string} searchTerm - Search term for address
 * @param {string} country - Country code (default: 'CAN')
 * @returns {Promise<Object>} - Address suggestions response
 */
export const getAddressSuggestions = async (searchTerm, country = 'CAN') => {
  try {
    console.log('Calling search-address API with:', { searchTerm, country })
    const response = await axios.post(`${URL}/search-address`, {
      SearchTerm: searchTerm,
      country: country,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Search-address API response:', response.data)
    return response.data;
  } catch (error) {
    console.error('Error getting address suggestions:', error);
    throw error;
  }
};

/**
 * Get Canada address suggestions
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.searchTerm - Search term for address
 * @param {string} searchParams.postalcode - Postal code (optional)
 * @returns {Promise<Object>} - Address suggestions response
 */
export const getCanadaAddressSuggestions = async (searchParams) => {
  try {
    const response = await axios.post(ADDRESS_VALIDATION_ENDPOINTS.CANADA_ADDRESS, {
      searchTerm: searchParams.searchTerm || '',
      postalcode: searchParams.postalcode || '',
      maxResults: searchParams.maxResults || 10
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting Canada address suggestions:', error);
    throw error;
  }
};

/**
 * Validate Canadian postal code format
 * @param {string} postalcode - Postal code to validate
 * @returns {boolean} - True if valid format
 */
export const validateCanadianPostalCode = (postalcode) => {
  const canadianPostalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return canadianPostalCodeRegex.test(postalcode);
};

/**
 * Format Canadian postal code
 * @param {string} postalcode - Postal code to format
 * @returns {string} - Formatted postal code
 */
export const formatCanadianPostalCode = (postalcode) => {
  // Remove spaces and convert to uppercase
  const cleaned = postalcode.replace(/\s/g, '').toUpperCase();
  
  // Format as A1A 1A1
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  return cleaned;
};

/**
 * Comprehensive address validation
 * @param {Object} addressData - Complete address data
 * @returns {Promise<Object>} - Validation results
 */
export const comprehensiveAddressValidation = async (addressData) => {
  try {
    const results = {
      address: null,
      city: null,
      postalcode: null,
      overall: null
    };

    // Validate postal code
    if (addressData.postalcode) {
      results.postalcode = {
        isValid: validateCanadianPostalCode(addressData.postalcode),
        formatted: formatCanadianPostalCode(addressData.postalcode)
      };
    }

    // Validate city and state format
    if (addressData.city) {
      const cityParts = addressData.city.split(',').map(part => part.trim());
      results.city = {
        isValid: cityParts.length >= 2,
        city: cityParts[0] || '',
        state: cityParts[1] || '',
        parts: cityParts
      };
    }

    // Overall validation
    results.overall = {
      isValid: results.postalcode?.isValid && results.city?.isValid,
      score: 0
    };

    if (results.postalcode?.isValid) results.overall.score += 50;
    if (results.city?.isValid) results.overall.score += 50;

    return results;
  } catch (error) {
    console.error('Error in comprehensive address validation:', error);
    throw error;
  }
};
