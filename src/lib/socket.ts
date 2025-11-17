import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './api-client';
import { Notification } from '@/types/api';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (onNotification?: (notification: Notification) => void, onOrderUpdate?: (order: any) => void) => {
  const token = getAccessToken();

  if (!token) {
    console.warn('No access token found, skipping socket connection');
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  // Notification events
  socket.on('notification', (notification: Notification) => {
    console.log('📬 New notification:', notification);
    if (onNotification) {
      onNotification(notification);
    }
  });

  // Admin notification events
  socket.on('admin-notification', (notification: Notification) => {
    console.log('👑 Admin notification:', notification);
    if (onNotification) {
      onNotification(notification);
    }
  });

  // Order update events
  socket.on('order-update', (order: any) => {
    console.log('📦 Order update:', order);
    if (onOrderUpdate) {
      onOrderUpdate(order);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

export const getSocket = () => socket;

export const emitEvent = (event: string, data: any) => {
  if (socket?.connected) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not connected, cannot emit event:', event);
  }
};

