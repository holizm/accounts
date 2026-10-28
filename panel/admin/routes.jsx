import { lazy } from 'react'
export default [{
    component: lazy(() => import('./recordVisibility/form')),
    path: '/accounts/user/recordVisibility'
}]
