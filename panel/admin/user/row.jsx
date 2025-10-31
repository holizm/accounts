const row = entity => <>
    <td>{(entity.naturalPersonName || entity.juridicalPersonName) || entity.userName}</td>
</>

export default row
