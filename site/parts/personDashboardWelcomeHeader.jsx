export default ({
    personInfo,
    profileUrl,
    session,
    translations,
}) => {

    return <header class='summary'>
        <div class='intro'>
            <h1>
                {translations?.coreWelcome}
                {' '}
                {personInfo.person?.displayName ?? session?.value?.user?.name}
            </h1>

        </div>
        <div class='actions'>
            <a
                class='editProfile'
                href={profileUrl}
            >
                {
                    translations?.accountsEditProfile
                }
            </a>
        </div>
    </header>
}
