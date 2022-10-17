import { connect } from "react-redux"

const Notification = (props) => {
  const style = props.notifications ? {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  } : {
    display: 'none',
  }

  return (
    <div style={style}>
      {props.notifications}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  }
}

export default connect(mapStateToProps)(Notification);