using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;
using AppOwnsDataAdmin.Models;
using AppOwnsDataAdmin.Services;

namespace AppOwnsDataAdmin.Controllers {

  [Authorize]
  public class HomeController : Controller {

    private PowerBiServiceApi powerBiServiceApi;
    private AppOwnsDataDBService AppOwnsDataDBService;

    public HomeController(PowerBiServiceApi powerBiServiceApi, AppOwnsDataDBService AppOwnsDataDBService) {
      this.powerBiServiceApi = powerBiServiceApi;
      this.AppOwnsDataDBService = AppOwnsDataDBService;
    }

    [AllowAnonymous]
    public IActionResult Index() {
      return View();
    }

    public IActionResult Tenants() {
      var model = AppOwnsDataDBService.GetTenants();
      return View(model);
    }

    public IActionResult Tenant(string Name) {
      var model = AppOwnsDataDBService.GetTenant(Name);
      var modelWithDetails = powerBiServiceApi.GetTenantDetails(model);
      return View(modelWithDetails);
    }

    public class OnboardTenantModel {
      public string TenantName { get; set; }
      public string WorkspaceId { get; set; }
    }

    public IActionResult OnboardTenant() {
      var model = new OnboardTenantModel {
        TenantName = this.AppOwnsDataDBService.GetNextTenantName(),
        WorkspaceId = ""
      };
      return View(model);
    }

    [HttpPost]
    public IActionResult OnboardTenant(string TenantName, string WorkspaceId) {
      var tenant = new PowerBiTenant {
        Name = TenantName,
        WorkspaceId = WorkspaceId
      };    

      tenant = this.powerBiServiceApi.OnboardNewTenant(tenant);
      this.AppOwnsDataDBService.OnboardNewTenant(tenant);

      return RedirectToAction("Tenants");
    }

    public IActionResult DeleteTenant(string TenantName) {
      var tenant = this.AppOwnsDataDBService.GetTenant(TenantName);
      this.powerBiServiceApi.DeleteTenant(tenant);
      this.AppOwnsDataDBService.DeleteTenant(tenant);
      return RedirectToAction("Tenants");
    }

    public IActionResult Embed(string TenantName, string ReportId = null) {
      var tenant = this.AppOwnsDataDBService.GetTenant(TenantName);
      var viewModel = this.powerBiServiceApi.GetReportEmbeddingData(tenant, ReportId).Result;
      return View(viewModel);
    }

    public IActionResult Users() {
      var model = AppOwnsDataDBService.GetUsers();
      return View(model);
    }
   
    public IActionResult GetUser(string LoginId) {
      var model = AppOwnsDataDBService.GetUser(LoginId);
      return View(model);
    }

    public class EditUserModel {
      public User User { get; set; }
      public List<SelectListItem> TenantOptions { get; set; }
      public IList<Microsoft.PowerBI.Api.Models.Report> AvailableReports { get; set; }
    }

    public IActionResult EditUser(string LoginId) {
      var user = AppOwnsDataDBService.GetUser(LoginId);
      IList<Microsoft.PowerBI.Api.Models.Report> reports = new List<Microsoft.PowerBI.Api.Models.Report>();
      if (!string.IsNullOrEmpty(user.TenantName)) {
        var tenant = AppOwnsDataDBService.GetTenant(user.TenantName);
        if (tenant != null) {
          try {
            reports = powerBiServiceApi.GetTenantDetails(tenant).Reports;
          } catch (Exception) {
            // Gracefully handle if API is not fully configured yet
          }
        }
      }

      var model = new EditUserModel{
        User = user,
        TenantOptions = this.AppOwnsDataDBService.GetTenants().Select(tenant => new SelectListItem {
                Text = tenant.Name,
                Value = tenant.Name
              }).ToList(),
        AvailableReports = reports
      };
      return View(model);
    }

    [HttpPost]
    public IActionResult EditUser(User user, string[] SelectedReportIds) {
      user.AllowedReportIds = SelectedReportIds != null && SelectedReportIds.Length > 0
          ? string.Join(",", SelectedReportIds)
          : "none";
      var model = AppOwnsDataDBService.UpdateUser(user);
      return RedirectToAction("Users");
    }

    public class CreateUserModel {
      public List<SelectListItem> TenantOptions { get; set; }
    }

    public IActionResult CreateUser() {
      var model = new CreateUserModel {
        TenantOptions = this.AppOwnsDataDBService.GetTenants().Select(tenant => new SelectListItem {
          Text = tenant.Name,
          Value = tenant.Name
        }).ToList(),
      };
      return View(model);
    }

    [HttpPost]
    public IActionResult CreateUser(User user) {
      var model = AppOwnsDataDBService.CreateUser(user);
      return RedirectToAction("Users");
    }

    public IActionResult DeleteUser(string LoginId) {
      var user = this.AppOwnsDataDBService.GetUser(LoginId);
      this.AppOwnsDataDBService.DeleteUser(user);
      return RedirectToAction("Users");
    }

    public IActionResult ActivityLog() {
      var model = AppOwnsDataDBService.GetActivityLog();
      return View(model);
    }

    public IActionResult ActivityEvent(int id) {
      ActivityLogEntry model = AppOwnsDataDBService.GetActivityLogEntry(id);
      return View(model);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() {
      return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
  }
}
