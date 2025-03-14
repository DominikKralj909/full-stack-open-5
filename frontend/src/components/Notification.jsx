const Notification = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{ 
            border: '1px solid black', 
            padding: '10px', 
            marginBottom: '10px', 
            backgroundColor: 'lightgray' 
        }}>
            {message}
        </div>
    );
};

export default Notification;