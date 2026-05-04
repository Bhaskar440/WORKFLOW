import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define your protected routes
const isProtectedRoute = createRouteMatcher(['/editor(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Check if the current request is for a protected route
  if (isProtectedRoute(req)) {
    // Calling await auth() returns the session claims. 
    // In newer versions, .protect() is called directly on the awaited auth.
    await auth.protect(); 
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};