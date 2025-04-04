import { useAtom } from "jotai";
import { Bell } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  notificationsAtom, 
  unreadNotificationsCountAtom, 
  markNotificationAsReadAtom,
  markAllNotificationsAsReadAtom,
  clearAllNotificationsAtom
} from "@/store/notifications";
import { Button } from "./ui/button";
import { cn } from "@/utils";

export function NotificationBell() {
  const [notifications] = useAtom(notificationsAtom);
  const [unreadCount] = useAtom(unreadNotificationsCountAtom);
  const [, markAsRead] = useAtom(markNotificationAsReadAtom);
  const [, markAllAsRead] = useAtom(markAllNotificationsAsReadAtom);
  const [, clearAll] = useAtom(clearAllNotificationsAtom);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "border-b border-gray-200 p-4 dark:border-gray-800",
                      !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 rounded-full p-1",
                          notification.type === "success" && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                          notification.type === "error" && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                          notification.type === "warning" && "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                          notification.type === "info" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        {notification.type === "success" && "✓"}
                        {notification.type === "error" && "✕"}
                        {notification.type === "warning" && "!"}
                        {notification.type === "info" && "i"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 