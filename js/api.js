/**
 * ============================================================
 * API FOUNDATION
 * STEP 10A
 * ============================================================
 */

const API = {

    baseUrl: "",


    async call(action, data = {}) {

        if (!this.baseUrl) {

            console.warn(
                "API base URL has not been configured yet."
            );

            return {
                success: false,
                message: "API is not configured yet."
            };
        }


        try {

            const response = await fetch(
                this.baseUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({
                        action: action,
                        data: data
                    })
                }
            );


            const result =
                await response.json();

            return result;


        } catch (error) {

            console.error(
                "API Error:",
                error
            );

            return {
                success: false,
                message:
                    "Unable to connect to the server."
            };
        }
    }

};
