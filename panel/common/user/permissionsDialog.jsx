import { useReviewedSubmission } from 'hooks'
import {
    DialogForm,
    ReviewDialog,
} from 'form'
import { AccountsUserPermissionInputs as PermissionInputs } from 'accountsCommon'
import { AccountsUserPermissionReview as PermissionReview } from 'accountsCommon'

export default ({
    item,
    ...rest
}) => {
    const submission = useReviewedSubmission({
        previewUrl: '/accounts/user/previewPermissions',
        submitUrl: '/accounts/user/setPermissions',
    })
    return <>
        <DialogForm
            {...rest}
            inputs={<PermissionInputs />}
            itemLoadingUrl={`/accounts/user/permissions?id=${item.id}`}
            large
            noMeaning
            okAction={submission.requestReview}
            okText='coreReview'
            title='permissions'
        />
        <ReviewDialog
            cancel={submission.cancel}
            confirm={submission.confirm}
            content={<PermissionReview rows={submission.review?.rows || []} />}
            hasChanges={submission.review?.hasChanges}
            progress={submission.progress}
            visible={Boolean(submission.review)}
        />
    </>
}
