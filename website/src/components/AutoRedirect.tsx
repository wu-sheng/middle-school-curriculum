"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProgress } from "@/lib/progressContext";

/**
 * Auto-redirects to the last visited page on initial load (homepage only).
 * Also records the current path as lastVisitedPath on navigation.
 */
export default function AutoRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, lastVisitedPath, recordPageVisit } = useProgress();
  const hasRedirected = useRef(false);

  // Auto-redirect on first homepage load
  useEffect(() => {
    if (
      !hasRedirected.current &&
      isLoggedIn &&
      lastVisitedPath &&
      pathname === "/" &&
      lastVisitedPath !== "/"
    ) {
      hasRedirected.current = true;
      router.replace(lastVisitedPath);
    }
  }, [isLoggedIn, lastVisitedPath, pathname, router]);

  // Record current page visit (skip homepage)
  useEffect(() => {
    if (isLoggedIn && pathname && pathname !== "/") {
      recordPageVisit(pathname);
    }
  }, [isLoggedIn, pathname, recordPageVisit]);

  return null;
}
