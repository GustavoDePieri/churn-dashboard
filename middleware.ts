export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/reactivations',
    '/monthly-report',
    '/debug',
  ],
};

