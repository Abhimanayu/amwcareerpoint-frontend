'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { submitEnquiry } from '@/lib/enquiries';
import { handleApiError } from '@/lib/handleApiError';

type CourseOption = '' | 'mbbs' | 'bds' | 'md' | 'other';
type CountryOption = '' | 'russia' | 'ukraine' | 'georgia' | 'kazakhstan' | 'other';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState<CourseOption>('');
  const [country, setCountry] = useState<CountryOption>('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required';
    else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address';
    if (!phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[\d+\-\s()]{7,15}$/.test(phone.trim())) errors.phone = 'Enter a valid phone number';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setError('');
    try {
      const composedMessage = [
        course ? `Course: ${course.toUpperCase()}` : null,
        message || null,
      ]
        .filter(Boolean)
        .join('\n');

      await submitEnquiry({
        name,
        email,
        phone,
        interestedCountry: country || '',
        source: 'contact-page',
        message: composedMessage,
      });

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setCourse('');
      setCountry('');
      setMessage('');
    } catch (err) {
      setError(handleApiError(err));
      setStatus('error');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })); }}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your full name"
        />
        {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })); }}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your email"
        />
        {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: '' })); }}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${fieldErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Enter your phone number"
        />
        {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
      </div>

      <div>
        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
          Course Interested In
        </label>
        <select
          id="course"
          name="course"
          value={course}
          onChange={(e) => setCourse(e.target.value as CourseOption)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a course</option>
          <option value="mbbs">MBBS</option>
          <option value="bds">BDS</option>
          <option value="md">MD</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Country
        </label>
        <select
          id="country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryOption)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a country</option>
          <option value="russia">Russia</option>
          <option value="ukraine">Ukraine</option>
          <option value="georgia">Georgia</option>
          <option value="kazakhstan">Kazakhstan</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about your requirements..."
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {status === 'success' && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Thanks! We received your enquiry and will contact you shortly.
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
