type SupportCard = { title?: string; subtitle?: string };

const additionalCards = [
  { title: 'Pre-departure briefing', subtitle: 'Prepare for travel and your first days on campus.' },
  { title: 'Counsellor follow-up', subtitle: 'Stay in touch with your counsellor for guidance and questions.' },
];

export function expandCountrySupportCards(cards: SupportCard[]) {
  // Carry the existing six-card layout into the new eight-card editor.
  // Other custom card counts remain under admin control.
  if (cards.length !== 6) return cards.slice(0, 8);
  const result = [...cards];
  const normalize = (title?: string) => (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const card of [
    ...additionalCards,
    { title: 'Fee planning', subtitle: 'Review tuition, accommodation and living costs with your counsellor.' },
    { title: 'Accommodation planning', subtitle: 'Discuss hostel options and arrival arrangements with your counsellor.' },
    { title: 'Application checklist', subtitle: 'Review pending application steps with your counsellor.' },
    { title: 'Student questions', subtitle: 'Discuss your questions before deciding on a university.' },
  ]) {
    if (!result.some(existing => normalize(existing.title) === normalize(card.title))) result.push(card);
    if (result.length === 8) break;
  }
  return result;
}
