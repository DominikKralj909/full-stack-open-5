function Toggleable({ visible, children }) {
	return (
		<>
			{visible ? children : null}
		</>
	);
}

export default Toggleable;