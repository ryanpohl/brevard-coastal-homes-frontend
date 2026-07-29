'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(nextPage) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '32px 0' }}>
      <button type="button" className="btn btn-outline" disabled={page <= 1} onClick={() => goTo(page - 1)}>
        Previous
      </button>
      <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--color-muted)' }}>
        Page {page} of {totalPages}
      </span>
      <button type="button" className="btn btn-outline" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Next
      </button>
    </div>
  );
}
