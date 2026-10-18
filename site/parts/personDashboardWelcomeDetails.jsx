import NaturalPersonProfile from 'contactsNaturalPersonProfile'
import JuridicalPersonProfile from 'contactsJuridicalPersonProfile'

export default ({
    personInfo,
    session,
    translations,
}) => {
    const personType = personInfo?.person?.personType

    if (personType === 'individual')
        return <NaturalPersonProfile
            personInfo={personInfo}
            session={session}
            translations={translations}
        />

    if (personType === 'juridical')
        return <JuridicalPersonProfile
            personInfo={personInfo}
            session={session}
            translations={translations}
        />
    return null
    // return <UnknownProfile
    //     personInfo={personInfo}
    //     session={session}
    //     translations={translations}
    // />
}
