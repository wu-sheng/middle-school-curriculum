"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProgress } from "@/lib/progressContext";

/**
 * Auto-redirects to the last visited page on initial load (homepage only).
 * Records lastVisitedPath only after 60s stay on a page (meaningful engagement).
 */
export default function AutoRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, lastVisitedPath, recordPageVisit } = useProgress();
  const hasRedirected = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Record page visit after 60s stay (meaningful engagement)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLoggedIn || !pathname || pathname === "/") return;

    timerRef.current = setTimeout(() => {
      recordPageVisit(pathname);
    }, 60 * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoggedIn, pathname, recordPageVisit]);

  return null;
}
