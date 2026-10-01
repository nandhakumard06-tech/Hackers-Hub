export interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  hackingLevel?: string;
  attendedWolfCTF?: string;
  attendedWolfHackathons?: string;
  general?: string;
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim().toLowerCase());
}

export function validateIndianMobile(mobile: string): { isValid: boolean; formatted: string } {
  if (!mobile) return { isValid: false, formatted: '' };

  // Remove all non-numeric characters except leading +
  const cleaned = mobile.trim().replace(/[\s\-()]/g, '');

  // Patterns:
  // 1. +91XXXXXXXXXX (13 chars)
  // 2. 91XXXXXXXXXX (12 chars starting with 91)
  // 3. 0XXXXXXXXXX (11 chars starting with 0)
  // 4. XXXXXXXXXX (10 chars starting with 6,7,8,9)

  const indian10Regex = /^[6-9]\d{9}$/;
  
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }
  
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, formatted: `+${cleaned}` };
  }
  
  if (/^0[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, formatted: `+91${cleaned.substring(1)}` };
  }

  if (indian10Regex.test(cleaned)) {
    return { isValid: true, formatted: `+91${cleaned}` };
  }

  return { isValid: false, formatted: cleaned };
}

export function validateRegistrationForm(data: {
  name: string;
  email: string;
  mobile: string;
  hackingLevel: string;
  attendedWolfCTF: string;
  attendedWolfHackathons: string;
}): { isValid: boolean; errors: ValidationErrors; formattedMobile: string } {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(data.name.trim())) {
    errors.name = 'Full name can only contain letters and spaces.';
  }

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // Mobile validation
  const mobileCheck = validateIndianMobile(data.mobile);
  if (!data.mobile || !data.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!mobileCheck.isValid) {
    errors.mobile = 'Enter a valid 10-digit Indian mobile number (+91XXXXXXXXXX).';
  }

  // Dropdown validations
  if (!data.hackingLevel || !['basic', 'intermediate', 'advanced'].includes(data.hackingLevel)) {
    errors.hackingLevel = 'Please select your ethical hacking level.';
  }

  if (!data.attendedWolfCTF || !['yes', 'no'].includes(data.attendedWolfCTF)) {
    errors.attendedWolfCTF = 'Please select if you have attended Wolf CTF.';
  }

  if (!data.attendedWolfHackathons || !['yes', 'no'].includes(data.attendedWolfHackathons)) {
    errors.attendedWolfHackathons = 'Please select if you have attended Wolf Hackathons.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedMobile: mobileCheck.formatted || data.mobile.trim(),
  };
}
