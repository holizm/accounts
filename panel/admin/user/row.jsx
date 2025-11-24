const row = item => <>
    <td>{(item.naturalPersonName || item.juridicalPersonName) || item.userName}</td>
</>

export default row
