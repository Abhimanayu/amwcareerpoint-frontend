export type MbbsDestinationLink = {
  country: string;
  href: string;
  label: string;
};

export const MBBS_DESTINATION_LINKS: MbbsDestinationLink[] = [
  { country: 'Russia', href: '/countries/mbbs-in-russia', label: 'MBBS in Russia' },
  { country: 'UK', href: '/countries/uk', label: 'MBBS in UK' },
  { country: 'Georgia', href: '/countries/mbbs-in-georgia', label: 'MBBS in Georgia' },
  { country: 'Kazakhstan', href: '/countries/kazakhstan', label: 'MBBS in Kazakhstan' },
  { country: 'Uzbekistan', href: '/countries/uzbekistan', label: 'MBBS in Uzbekistan' },
  { country: 'Kyrgyzstan', href: '/countries/mbbs-in-kyrgyzstan', label: 'MBBS in Kyrgyzstan' },
];

export function getMbbsDestinationLinks() {
  return MBBS_DESTINATION_LINKS;
}
