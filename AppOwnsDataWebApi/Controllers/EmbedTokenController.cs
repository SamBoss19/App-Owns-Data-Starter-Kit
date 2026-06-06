using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Microsoft.AspNetCore.Cors;
using AppOwnsDataWebApi.Models;
using AppOwnsDataWebApi.Services;

namespace AppOwnsDataWebApi.Controllers {

  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [RequiredScope("Reports.Embed")]
  [EnableCors("AllowOrigin")]
  public class EmbedTokenController : ControllerBase {

    private PowerBiServiceApi powerBiServiceApi;

    public EmbedTokenController(PowerBiServiceApi powerBiServiceApi) {
      this.powerBiServiceApi = powerBiServiceApi;
    }

    [HttpGet]
    public async Task<ActionResult<EmbedTokenResult>> Get() {
      string user = this.User.GetUserLoginId();
      if (string.IsNullOrEmpty(user)) {
        return Unauthorized("User login ID could not be identified from token claims.");
      }
      return await this.powerBiServiceApi.GetEmbedToken(user);
    }

  }

}
