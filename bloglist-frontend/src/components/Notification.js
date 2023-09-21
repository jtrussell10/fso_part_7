import { useNotificationValue } from "../contexts/NotificationContext";

const Notification = () => {
  const { message, style } = useNotificationValue();

  if (message === "") {
    return null;
  }

  return <div className={`notification ${style}`}>{message}</div>;
};

export default Notification;
