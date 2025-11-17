'use client';

import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { notificationsService } from '@/services/notifications.service';
import { useState } from 'react';
import { formatDistance } from 'date-fns';
import { useToast } from './ui/use-toast';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      markAsRead(id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllAsRead();
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsService.deleteNotification(id);
      removeNotification(id);
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[600px] overflow-hidden flex flex-col border">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">
                              {notification.title}
                            </h4>
                            <span
                              className={`text-xs ${getPriorityColor(
                                notification.priority
                              )}`}
                            >
                              ●
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDistance(
                              new Date(notification.createdAt),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

