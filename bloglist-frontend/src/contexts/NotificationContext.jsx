import { createContext, useReducer, useContext, useEffect } from 'react';

const notificationReducer = (state = '', action) => {
    let style = 'success';  // Default style
  
    // Handling custom messages
    if ('message' in action) {
      return { message: action.message, style };
    }
  
    if ('error_message' in action) {
      return { message: action.error_message, style: 'error' };
    }
  
    // Handling predefined action types
    switch (action.type) {
      case 'LOGIN':
        return { message: 'Successfully logged in', style };
      case 'LOGOUT':
        return { message: 'Successfully logged out', style };
      case 'VOTE':
        return { message: 'Voted', style };
      case 'CREATED':
        return { message: 'Blog created', style };
      case 'LIKED':
        return { message: 'Blog liked', style };
      case 'DELETED':
        return { message: 'Blog deleted', style };
        case 'UPDATED':
    return { message: 'Blog updated', style };
      case 'ERROR_CREATE':
        return { message: 'Failed to create blog', style: 'error' };
      case 'ERROR_LOGIN':
        return { message: 'Failed to login', style: 'error' };
      case 'ERROR_LIKE':
        return { message: 'Failed to like blog', style: 'error' };
      case 'ERROR_DELETE':
        return { message: 'Failed to delete blog', style: 'error' };
      case 'CLEAR_NOTIFICATION':
        return { message: '', style };
        case 'ERROR_UPDATE':
    return { message: 'Failed to update blog', style: 'error' };
      default:
        return state;
    }
  };
  
  

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '');

  useEffect(() => {
    let timeoutId;

    // Check if notification exists and is not empty
    if (notification !== '') {
      timeoutId = setTimeout(() => {
        // Clear the notification after 5 seconds
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [notification]);

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;
