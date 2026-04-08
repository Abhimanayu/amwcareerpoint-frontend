'use client';

import { useState } from 'react';

export function CounsellingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    emailAddress: '',
    neetScore: '',
    preference: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = 'h-9 w-full rounded-lg border border-[#DDD9D2] bg-white px-3 text-[13px] text-[#0D1B3E] outline-none transition-all focus:border-[#F26419] focus:ring-2 focus:ring-orange-100';

  return (
    <div id="counselling" className="w-full max-w-none sm:max-w-[400px] rounded-2xl border border-[#DDD9D2] bg-white p-4 sm:p-5 shadow-md">
      <div className="mb-3">
        <h3 className="font-heading text-[17px] font-bold text-[#0D1B3E]">Get Free Counselling</h3>
        <p className="text-[11px] text-[#4A4742] mt-0.5">Expert will call you within 2 hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Full Name</label>
            <input type="text" name="fullName" placeholder="Your Name" required value={formData.fullName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Phone No.</label>
            <input type="tel" name="phoneNo" placeholder="+91 XXXXX XXXXX" required value={formData.phoneNo} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Email Address</label>
          <input type="email" name="emailAddress" placeholder="you@email.com" required value={formData.emailAddress} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">NEET Score</label>
            <select name="neetScore" required value={formData.neetScore} onChange={handleChange} className={inputClass}>
              <option value="">Select Range</option>
              <option value="600+">600+</option>
              <option value="500-599">500-599</option>
              <option value="400-499">400-499</option>
              <option value="300-399">300-399</option>
              <option value="200-299">200-299</option>
              <option value="Below 200">Below 200</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Preference</label>
            <select name="preference" required value={formData.preference} onChange={handleChange} className={inputClass}>
              <option value="">Study Destination</option>
              <option value="India">MBBS in India</option>
              <option value="Russia">MBBS in Russia</option>
              <option value="Ukraine">MBBS in Ukraine</option>
              <option value="Georgia">MBBS in Georgia</option>
              <option value="Kazakhstan">MBBS in Kazakhstan</option>
              <option value="Uzbekistan">MBBS in Uzbekistan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0D1B3E] mb-1">Message (Optional)</label>
          <textarea name="message" placeholder="Tell us about your goals..." rows={2} value={formData.message} onChange={handleChange} className="w-full resize-none rounded-lg border border-[#DDD9D2] bg-white px-3 py-2 text-sm text-[#0D1B3E] outline-none transition-all focus:border-[#F26419] focus:ring-2 focus:ring-orange-100" />
        </div>

        <button type="submit" className="w-full h-10 rounded-full bg-[#F26419] text-white text-[13px] font-bold hover:bg-[#FF8040] transition-colors">
          Submit &amp; Get Free Guidance →
        </button>

        <p className="text-center text-[11px] text-[#4A4742]">
          🔒 100% Free · No spam · Verified counsellors only
        </p>
      </form>
    </div>
  );
}
