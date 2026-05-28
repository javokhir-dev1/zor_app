import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket(namespace = '/') {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(namespace, { transports: ['websocket', 'polling'] });
    
    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    
    setSocket(newSocket);
    
    return () => { newSocket.disconnect(); };
  }, [namespace]);

  return { socket, connected };
}
