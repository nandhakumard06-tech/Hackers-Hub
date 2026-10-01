import { RegistrationFormData } from '../types/registration';

/**
 * Submits registration to the secure serverless backend endpoint.
 * No database credentials or client-side keys are stored or exposed in the frontend bundle.
 */
export async function createRegistration(data: RegistrationFormData): Promise<{ id: string }> {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Failed to submit registration. Please try again.');
  }

  return { id: result.id || 'reg_completed' };
}
