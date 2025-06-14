
import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Votre commande est en cours de validation",
    description: "Un administrateur examine votre demande.",
    date: "Aujourd'hui",
    seen: false,
  },
  {
    id: 2,
    title: "Bienvenue sur la plateforme !",
    description: "Merci de rejoindre notre communauté.",
    date: "Hier",
    seen: true,
  },
];

const NotificationsFeed = () => (
  <div className="pt-20 max-w-md mx-auto">
    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
      <Bell className="w-5 h-5 text-primary" /> Notifications
    </h2>
    <div className="space-y-3">
      {notifications.length === 0 && (
        <div className="text-muted-foreground text-center py-6">
          Aucune notification pour l'instant.
        </div>
      )}
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`rounded-lg border p-4 bg-background transition-all ${
            !notif.seen ? "border-primary/50 bg-primary/5" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium">{notif.title}</div>
            <span className="text-xs text-muted-foreground">{notif.date}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">{notif.description}</div>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationsFeed;
