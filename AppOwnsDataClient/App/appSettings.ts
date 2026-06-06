export default class AppSettings {

  // replace with production URL after deploying Web API
  public static apiRoot: string = "https://localhost:44302/api/"; 

  // setting for Azure AD app which supports SPA authentication
  public static tenant: string = "afb0208b-f6f7-4528-a922-c6cd23a104fa";
  public static clientId: string = "6c527b9a-1095-4e6d-be4e-34d62304fe0e";
 
  // permission scopes required with App-Owns-Data Web API
  public static apiScopes: string[] = [
    "api://" + AppSettings.clientId + "/Reports.Embed"
  ];

}