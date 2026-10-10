import UnsubscribeClient from './UnsubscribeClient';

// Landing page for the "Unsubscribe" link in new-listing alert emails
// (2026-10-09) and one-home price/status alert emails (2026-10-10; `all=1`
// stops every home that email is watching). Kept out of search results.
export const metadata = {
  title: 'Unsubscribe from listing alerts | Brevard Coastal Homes',
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }) {
  const { token, all } = await searchParams;
  return (
    <div className="container" style={{ maxWidth: 560, padding: '64px 16px', textAlign: 'center' }}>
      <UnsubscribeClient token={token || ''} all={all === '1'} />
    </div>
  );
}
