'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/lib/enquiries';

export function CounsellingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    emailAddress: '',
    neetScore: '',
    preference: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Name is required';
    else if (formData.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters';
    if (!formData.phoneNo.trim()) errors.phoneNo = 'Phone number is required';
    else if (!/^[\d+\-\s()]{7,15}$/.test(formData.phoneNo.trim())) errors.phoneNo = 'Enter a valid phone number';
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
      await submitEnquiry({
        name: formData.fullName,
        email: formData.emailAddress,
        phone: formData.phoneNo,
        interestedCountry: formData.preference,
        message: formData.neetScore
          ? `NEET Score: ${formData.neetScore}. ${formData.message}`.trim()
          : formData.message,
        source: 'counselling-form',
      });
      setSubmitted(true);
      setFormData({ fullName: '', phoneNo: '', emailAddress: '', neetScore: '', preference: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const inputClass = 'h-10 sm:h-9 w-full rounded-lg border border-[#DDD9D2] bg-white px-3 text-sm sm:text-[13px] text-[#0D1B3E] outline-none transition-all focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';
  const errorInputClass = 'h-10 sm:h-9 w-full rounded-lg border border-red-400 bg-white px-3 text-sm sm:text-[13px] text-[#0D1B3E] outline-none transition-all focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';

  return (
    <div id="counselling" className="w-full max-w-none sm:max-w-[400px] rounded-2xl border border-[#DDD9D2] bg-white p-4 sm:p-5 shadow-md">
      <div className="mb-3">
        <h3 className="font-heading text-[17px] font-bold text-[#0D1B3E]">Get Free Counselling</h3>
        <p className="text-[11px] text-[#4A4742] mt-0.5">Expert will call you within 2 hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {submitted && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-sm font-semibold text-green-700">Thank you! Our expert will call you within 2 hours.</p>
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Full Name</label>
            <input type="text" name="fullName" placeholder="Your Name" value={formData.fullName} onChange={handleChange} className={fieldErrors.fullName ? errorInputClass : inputClass} />
            {fieldErrors.fullName && <p className="mt-0.5 text-[10px] text-red-600">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Phone No.</label>
            <input type="tel" name="phoneNo" placeholder="+91 XXXXX XXXXX" value={formData.phoneNo} onChange={handleChange} className={fieldErrors.phoneNo ? errorInputClass : inputClass} />
            {fieldErrors.phoneNo && <p className="mt-0.5 text-[10px] text-red-600">{fieldErrors.phoneNo}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Email Address</label>
          <input type="email" name="emailAddress" placeholder="you@email.com" value={formData.emailAddress} onChange={handleChange} className={fieldErrors.emailAddress ? errorInputClass : inputClass} />
          {fieldErrors.emailAddress && <p className="mt-0.5 text-[10px] text-red-600">{fieldErrors.emailAddress}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">NEET Score</label>
            <select name="neetScore" value={formData.neetScore} onChange={handleChange} className={fieldErrors.neetScore ? errorInputClass : inputClass}>
              <option value="">Select Range</option>
              <option value="600+">600+</option>
              <option value="500-599">500-599</option>
              <option value="400-499">400-499</option>
              <option value="300-399">300-399</option>
              <option value="200-299">200-299</option>
              <option value="Below 200">Below 200</option>
            </select>
            {fieldErrors.neetScore && <p className="mt-0.5 text-[10px] text-red-600">{fieldErrors.neetScore}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Preference</label>
            <select name="preference" value={formData.preference} onChange={handleChange} className={fieldErrors.preference ? errorInputClass : inputClass}>
              <option value="">Study Destination</option>
              <option value="India">MBBS in India</option>
              <option value="Russia">MBBS in Russia</option>
              <option value="Ukraine">MBBS in Ukraine</option>
              <option value="Georgia">MBBS in Georgia</option>
              <option value="Kazakhstan">MBBS in Kazakhstan</option>
              <option value="Uzbekistan">MBBS in Uzbekistan</option>
            </select>
            {fieldErrors.preference && <p className="mt-0.5 text-[10px] text-red-600">{fieldErrors.preference}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Message (Optional)</label>
          <textarea name="message" placeholder="Tell us about your goals..." rows={2} value={formData.message} onChange={handleChange} className="w-full resize-none rounded-lg border border-[#DDD9D2] bg-white px-3 py-2 text-sm text-[#0D1B3E] outline-none transition-all focus:border-[#F26419] focus:ring-2 focus:ring-orange-100" />
        </div>

        <button type="submit" disabled={submitting} className="w-full h-11 sm:h-10 rounded-full bg-[#F26419] text-white text-sm sm:text-[13px] font-bold hover:bg-[#FF8040] transition-colors disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit & Get Free Guidance →'}
        </button>

        <p className="text-center text-[11px] text-[#4A4742]">
          🔒 100% Free · No spam · Verified counsellors only
        </p>
      </form>
    </div>
  );
}
