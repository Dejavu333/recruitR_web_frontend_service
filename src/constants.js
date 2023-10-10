class CONSTANTS {
    static ERRORS = {
        NO_EMAILS_FOUND : 'No emails found',
    }

    static containsError(errorTextToCheck) {
        return Object.values(CONSTANTS.ERRORS).includes(errorTextToCheck);
    }
}

export { CONSTANTS };