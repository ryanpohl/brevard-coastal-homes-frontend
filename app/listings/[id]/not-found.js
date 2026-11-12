import ListingGone from '@/components/ListingGone';

export const metadata = {
  title: 'Home no longer available | Brevard Coastal Homes',
  robots: { index: false },
};

export default function ListingNotFound() {
  return <ListingGone />;
}
