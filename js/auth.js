/**
 * ============================================================
 * AUTH FOUNDATION
 * STEP 10A
 * ============================================================
 */

const AUTH = {

    STORAGE_KEY:
        "afc_isiu_youth_session",


    getSession() {

        try {

            const stored =
                localStorage.getItem(
                    this.STORAGE_KEY
                );

            if (!stored) {
                return null;
            }

            return JSON.parse(stored);

        } catch (error) {

            console.error(
                "Session read error:",
                error
            );

            return null;
        }
    },


    saveSession(session) {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(session)
        );

    },


    clearSession() {

        localStorage.removeItem(
            this.STORAGE_KEY
        );

    },


    isLoggedIn() {

        return !!this.getSession();

    }

};
