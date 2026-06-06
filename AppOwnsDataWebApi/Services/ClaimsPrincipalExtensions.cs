using System.Security.Claims;

namespace AppOwnsDataWebApi.Services {
  public static class ClaimsPrincipalExtensions {
    public static string GetUserLoginId(this ClaimsPrincipal principal) {
      if (principal == null) return null;

      // Try preferred_username
      var claim = principal.FindFirst("preferred_username");
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try Upn (User Principal Name)
      claim = principal.FindFirst(ClaimTypes.Upn);
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try standard upn string
      claim = principal.FindFirst("upn");
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try unique_name
      claim = principal.FindFirst("unique_name");
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try Name claim
      claim = principal.FindFirst(ClaimTypes.Name);
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try name string
      claim = principal.FindFirst("name");
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try Email claim
      claim = principal.FindFirst(ClaimTypes.Email);
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Try email string
      claim = principal.FindFirst("email");
      if (claim != null && !string.IsNullOrEmpty(claim.Value)) {
        return claim.Value;
      }

      // Fallback to Identity.Name
      if (principal.Identity != null && !string.IsNullOrEmpty(principal.Identity.Name)) {
        return principal.Identity.Name;
      }

      return null;
    }
  }
}
