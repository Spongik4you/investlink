import { NotificationsPageContent } from "@/components/dashboard/shared/NotificationsPageContent";

// Autorizarea de rută e făcută de middleware.ts. Notificările sunt per-USER
// (rol-agnostic): API-ul derivă destinatarul din sesiune, deci aceeași
// componentă servește toate cele trei roluri.
export default function NotificationsPage() {
  return <NotificationsPageContent />;
}
