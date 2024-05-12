import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRouteMatcher = createRouteMatcher([
  '/site(.*)',
  '/api/uploadthing(.*)',
  '/agency/sign-in(.*)',
  '/agency/sign-up(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!publicRouteMatcher(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
