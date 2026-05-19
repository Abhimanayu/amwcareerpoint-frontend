export function WhatsAppFloater() {
  return (
    <a
      href="https://wa.me/919929299268"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(37,211,102,0.35)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      <span className="text-2xl" aria-hidden="true">💬</span>
    </a>
  );
}
