'use client';

import { useEffect, useMemo, useState } from 'react';
import { submitEnquiry } from '@/lib/enquiries';
import { getCountries } from '@/lib/countries';
import { extractCollectionData } from '@/lib/utils';

const fallbackDestinations = [
  'India',
  'Russia',
  'Ukraine',
  'Georgia',
  'Kazakhstan',
  'Uzbekistan',
];

export function CounsellingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    city: '',
    pinCode: '',
    emailAddress: '',
    neetScore: '',
    preference: '',
    message: '',
  });
  const [destinations, setDestinations] = useState<string[]>(fallbackDestinations);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;

    getCountries({ limit: 500, sort: 'sortOrder' })
      .then((res) => {
        if (!mounted) return;

        const countries = extractCollectionData<Record<string, unknown>>(res, ['countries']);
        const names = countries
          .map((country) => (typeof country.name === 'string' ? country.name.trim() : ''))
          .filter(Boolean);
        const uniqueNames = Array.from(new Set(names));

        if (uniqueNames.length > 0) {
          setDestinations(uniqueNames);
        }
      })
      .catch(() => {
        if (mounted) {
          setDestinations(fallbackDestinations);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const destinationOptions = useMemo(() => [...destinations].sort((a, b) => a.localeCompare(b)), [destinations]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Name is required';
    else if (formData.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters';
    if (!formData.phoneNo.trim()) errors.phoneNo = 'Phone number is required';
    else if (!/^[\d+\-\s()]{7,15}$/.test(formData.phoneNo.trim())) errors.phoneNo = 'Enter a valid phone number';
    if (!formData.city.trim()) errors.city = 'City is required';
    else if (formData.city.trim().length < 2) errors.city = 'Enter a valid city';
    if (!formData.pinCode.trim()) errors.pinCode = 'Pin code is required';
    else if (!/^\d{4,10}$/.test(formData.pinCode.trim())) errors.pinCode = 'Enter a valid pin code';
    if (!formData.emailAddress.trim()) errors.emailAddress = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress.trim())) errors.emailAddress = 'Enter a valid email';
    if (!formData.neetScore) errors.neetScore = 'Select NEET score range';
    if (!formData.preference) errors.preference = 'Select study destination';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setError('');
    try {
      const leadDetails = [
        `City: ${formData.city.trim()}`,
        `Pin Code: ${formData.pinCode.trim()}`,
        formData.neetScore ? `NEET Score: ${formData.neetScore}` : '',
        formData.message.trim(),
      ].filter(Boolean).join('. ');

      await submitEnquiry({
        name: formData.fullName,
        email: formData.emailAddress,
        phone: formData.phoneNo,
        city: formData.city,
        pinCode: formData.pinCode,
        interestedCountry: formData.preference,
        message: leadDetails,
        source: 'counselling-form',
      });
      setSubmitted(true);
      setFormData({ fullName: '', phoneNo: '', city: '', pinCode: '', emailAddress: '', neetScore: '', preference: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((previous) => ({ ...previous, [e.target.name]: '' }));
  };

  const inputClass = 'h-12 w-full rounded-xl border border-[#DDD9D2] bg-white px-4 text-sm text-[#0D1B3E] outline-none transition-all placeholder:text-[#9AA3B7] focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';
  const errorInputClass = 'h-12 w-full rounded-xl border border-red-400 bg-white px-4 text-sm text-[#0D1B3E] outline-none transition-all placeholder:text-[#9AA3B7] focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';
  const labelClass = 'mb-2 block text-sm font-semibold text-[#0D1B3E]';
  const fieldErrorClass = 'mt-1 text-xs text-red-600';

  return (
    <div id="counselling" className="w-full max-w-none rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_24px_70px_rgba(13,27,62,0.16)] backdrop-blur sm:max-w-[500px] sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FFF4E9] text-xl font-bold text-[#F26419]">
          AMW
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#0D1B3E]">Get Free Counselling</h3>
          <p className="mt-1 text-sm text-[#4A4742]">Expert will call you within 2 hours</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitted && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
            <p className="text-sm font-semibold text-green-700">Thank you! Our expert will call you within 2 hours.</p>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" name="fullName" placeholder="Your Name" value={formData.fullName} onChange={handleChange} className={fieldErrors.fullName ? errorInputClass : inputClass} />
            {fieldErrors.fullName && <p className={fieldErrorClass}>{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone No.</label>
            <input type="tel" name="phoneNo" placeholder="+91 XXXXX XXXXX" value={formData.phoneNo} onChange={handleChange} className={fieldErrors.phoneNo ? errorInputClass : inputClass} />
            {fieldErrors.phoneNo && <p className={fieldErrorClass}>{fieldErrors.phoneNo}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>City</label>
            <input type="text" name="city" placeholder="Your City" value={formData.city} onChange={handleChange} className={fieldErrors.city ? errorInputClass : inputClass} />
            {fieldErrors.city && <p className={fieldErrorClass}>{fieldErrors.city}</p>}
          </div>
          <div>
            <label className={labelClass}>Pin Code</label>
            <input type="text" name="pinCode" inputMode="numeric" placeholder="Pin Code" value={formData.pinCode} onChange={handleChange} className={fieldErrors.pinCode ? errorInputClass : inputClass} />
            {fieldErrors.pinCode && <p className={fieldErrorClass}>{fieldErrors.pinCode}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input type="email" name="emailAddress" placeholder="you@email.com" value={formData.emailAddress} onChange={handleChange} className={fieldErrors.emailAddress ? errorInputClass : inputClass} />
          {fieldErrors.emailAddress && <p className={fieldErrorClass}>{fieldErrors.emailAddress}</p>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>NEET Score</label>
            <select name="neetScore" value={formData.neetScore} onChange={handleChange} className={fieldErrors.neetScore ? errorInputClass : inputClass}>
              <option value="">Select Range</option>
              <option value="600+">600+</option>
              <option value="500-599">500-599</option>
              <option value="400-499">400-499</option>
              <option value="300-399">300-399</option>
              <option value="200-299">200-299</option>
              <option value="Below 200">Below 200</option>
            </select>
            {fieldErrors.neetScore && <p className={fieldErrorClass}>{fieldErrors.neetScore}</p>}
          </div>
          <div>
            <label className={labelClass}>Preference</label>
            <select name="preference" value={formData.preference} onChange={handleChange} className={fieldErrors.preference ? errorInputClass : inputClass}>
              <option value="">Study Destination</option>
              {destinationOptions.map((country) => (
                <option key={country} value={country}>MBBS in {country}</option>
              ))}
            </select>
            {fieldErrors.preference && <p className={fieldErrorClass}>{fieldErrors.preference}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Message (Optional)</label>
          <textarea name="message" placeholder="Tell us about your goals..." rows={3} value={formData.message} onChange={handleChange} className="w-full resize-none rounded-xl border border-[#DDD9D2] bg-white px-4 py-3 text-sm text-[#0D1B3E] outline-none transition-all placeholder:text-[#9AA3B7] focus:border-[#F26419] focus:ring-2 focus:ring-orange-100" />
        </div>

        <button type="submit" disabled={submitting} className="w-full rounded-full bg-[#F26419] py-4 text-sm font-bold text-white transition-colors hover:bg-[#FF8040] disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit & Get Free Guidance ->'}
        </button>

        <p className="text-center text-xs text-[#4A4742]">
          100% Free - No spam - Verified counsellors only
        </p>
      </form>
    </div>
  );
}
