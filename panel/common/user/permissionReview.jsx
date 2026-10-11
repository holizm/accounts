import { useScopedTranslation } from 'hooks'

export default ({ rows }) => {
    const t = useScopedTranslation()
    return <table className='permissionReview'>
        <thead>
            <tr>
                <th>
                    {
                        t('action')
                    }
                </th>
                <th>
                    {
                        t('from')
                    }
                </th>
                <th>
                    {
                        t('to')
                    }
                </th>
            </tr>
        </thead>
        <tbody>
            {
                rows.map(row => <tr key={row.condition}>
                    <td>
                        {
                            row.condition
                        }
                    </td>
                    <td>
                        {
                            t(row.from)
                        }
                    </td>
                    <td>
                        {
                            t(row.to)
                        }
                    </td>
                </tr>)
            }
        </tbody>
    </table>
}
