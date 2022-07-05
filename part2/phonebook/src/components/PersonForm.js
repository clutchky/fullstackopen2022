
const PersonForm = (props) => {

    const {addName, newName, handleInputChange, newNumber, handlePhoneNumber} = props;

    return (
        <>
        <form onSubmit={addName}>
            <div>
            name: <input value={newName} onChange={handleInputChange} />
            </div>
            <div>
            number: <input value={newNumber} onChange={handlePhoneNumber} />
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
      </>
    )

}

export default PersonForm;