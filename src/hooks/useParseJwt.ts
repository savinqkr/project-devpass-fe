import { Permission } from "@enums";

export default function useParseJwt(token: any, haveNoToken: boolean): any {
    if (!haveNoToken) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );

        const parsedJsonPayload = JSON.parse(jsonPayload);

        const parsedJwt = {
            iat: parsedJsonPayload.iat,
            exp: parsedJsonPayload.exp,
            id: parsedJsonPayload.id,
            name: parsedJsonPayload.name,
            permission: parsedJsonPayload["https://hasura.io/jwt/claims"][
                "x-hasura-default-role"
            ] as Permission,
        };

        return parsedJwt;
    }
}
