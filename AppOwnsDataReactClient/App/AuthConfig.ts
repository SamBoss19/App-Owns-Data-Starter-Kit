import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config Azure AD app setting to be passed to Msal on creation
const TenantId = "afb0208b-f6f7-4528-a922-c6cd23a104fa";
const ClientId = "6c527b9a-1095-4e6d-be4e-34d62304fe0e";

export const msalConfig: Configuration = {
    auth: {
        clientId: ClientId,
        authority: "https://login.microsoftonline.com/" + TenantId,
        redirectUri: "/",
        postLogoutRedirectUri: "/"        
    }
};

export const userPermissionScopes: string[] = [
  "api://" + ClientId + "/Reports.Embed"
]

export const PowerBiLoginRequest: PopupRequest = {
  scopes: userPermissionScopes
};