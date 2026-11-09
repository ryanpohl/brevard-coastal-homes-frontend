// MLS listing photos (2026-11-09, per Ryan: photos were slow to load on the
// Indialantic homes page). Every photo used to go through next/image's
// resizer on the Hostinger server, which re-encodes it on first view (0.5–2 s
// each) and loses that cache on every deploy. The MLS photo service
// (cdn.resize.sparkplatform.com) already serves resized copies from a fast,
// shared cache, so MLS photos load straight from it at the size each spot
// needs, and next/image's resizer is skipped for them (`unoptimized`).
// Sizes it serves: 1024x768, 640x480 and 320x240 (smaller ones round to that).
const SPARK_RESIZE = /^(https:\/\/cdn\.resize\.sparkplatform\.com\/[^/]+\/)\d+x\d+(\/)/;

export function isMlsPhoto(url) {
  return SPARK_RESIZE.test(String(url || ''));
}

/** The same MLS photo at another size, e.g. mlsPhoto(url, '640x480'). Other URLs are returned as-is. */
export function mlsPhoto(url, size) {
  return String(url || '').replace(SPARK_RESIZE, `$1${size}$2`);
}
