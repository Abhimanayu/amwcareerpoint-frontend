export type MbbsDestinationLink = {
  country: string;
  href: string;
  label: string;
};

export const MBBS_DESTINATION_LINKS: MbbsDestinationLink[] = [
  { country: 'Russia', href: '/countries/russia', label: 'MBBS in Russia' },
  { country: 'Georgia', href: '/countries/georgia', label: 'MBBS in Georgia' },
  { country: 'Kazakhstan', href: '/countries/kazakhstan', label: 'MBBS in Kazakhstan' },
  { country: 'Uzbekistan', href: '/countries/uzbekistan', label: 'MBBS in Uzbekistan' },
  { country: 'Kyrgyzstan', href: '/countries/kyrgyzstan', label: 'MBBS in Kyrgyzstan' },
  { country: 'Philippines', href: '/countries/philippines', label: 'MBBS in Philippines' },
];

export function getMbbsDestinationLinks() {
  return MBBS_DESTINATION_LINKS;
}
