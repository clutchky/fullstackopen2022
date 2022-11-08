import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notifications }) => notifications);

  const handleNotification = () => {
    return <div className={notification.status}>{notification.message}</div>;
  };

  return (
    <div>
      {notification && handleNotification()}
    </div>
  );
};

export default Notification;