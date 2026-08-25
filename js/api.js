/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * API FOUNDATION
 * ============================================================
 */


async function apiRequest(
    action,
    payload = {}
) {

    if (
        !API_CONFIG ||
        !API_CONFIG.BASE_URL
    ) {

        throw new Error(
            "API configuration is missing."
        );

    }


    const response =
        await fetch(
            API_CONFIG.BASE_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify({

                        action:
                            action,

                        ...payload

                    })

            }
        );


    if (!response.ok) {

        throw new Error(
            "Backend request failed."
        );

    }


    const data =
        await response.json();


    return data;

}
