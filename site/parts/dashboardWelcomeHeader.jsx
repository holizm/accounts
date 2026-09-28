export default ({
    profileUrl,
    session,
    translations,
}) => <header class='summary'>
    <div class='intro'>
        <p class='message'>
            {
                translations?.dashboardWelcomeMessage
            }
        </p>
        <h1 class='title'>
            {
                session?.value?.user?.name
            }
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
