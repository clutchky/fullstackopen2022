const Notification = ({message, status}) => {

    if(status === 'red') {
        return (
            <div className="error">
                {message}
            </div>
        )
    }

    return (
      <div className="notification">
        {message}
      </div>
    )
  }

export default Notification;