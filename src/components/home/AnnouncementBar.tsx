export function AnnouncementBar() {
  return (
    <div className="bg-[#0D1B3E] px-3 sm:px-4 py-1 sm:py-1.5 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 sm:gap-3 text-center text-[10px] sm:text-[11px] font-medium">
        <span className="hidden sm:inline">🎓</span>
        <p className="truncate">2026 MBBS Admissions Open — Limited Seats!</p>
        <a href="tel:+919929299268" className="font-bold text-[#F26419] hover:text-[#FF8040] whitespace-nowrap shrink-0">
          Book Free Counselling →
        </a>
      </div>
    </div>
  );
}
