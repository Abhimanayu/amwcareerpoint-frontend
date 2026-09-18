'use client';
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="px-6 py-20 text-center"><h1 className="font-heading text-3xl text-[#0D1B3E]">We couldn’t load this guide</h1><p className="my-4">Please try again in a moment.</p><button onClick={reset} className="rounded-full bg-[#F26419] px-6 py-3 font-semibold text-white">Try again</button></div>; }
