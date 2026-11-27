// Link policy for the Markdown boundary (spec §4.3, §5.5;
// application-and-ui.md §7.1). Only the project's own Pages site may become an
// anchor; every other destination is rendered by the caller as plain text.

const ALLOWED_HOST = 'h-arnold.github.io';
const ALLOWED_PATH = '/CompSciQuest';

export function isAllowedLink(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  return (
    url.protocol === 'https:' &&
    url.hostname === ALLOWED_HOST &&
    (url.pathname === ALLOWED_PATH ||
      url.pathname.startsWith(`${ALLOWED_PATH}/`)) &&
    url.username === '' &&
    url.password === '' &&
    url.port === ''
  );
}
