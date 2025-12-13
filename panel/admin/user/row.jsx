export default item => <>
    <td>{(item.naturalPersonName || item.juridicalPersonName) || item.userName}</td>
</>
