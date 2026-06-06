using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.PowerBI.Api.Models.Credentials;
using Microsoft.Rest;
using AppOwnsDataShared.Models;
using Microsoft.Identity.Web;
using AppOwnsDataShared.Services;
using System.Text;

namespace AppOwnsDataAdmin.Services {

  public class EmbeddedReportViewModel {
    public string ReportId;
    public string Name;
    public string EmbedUrl;
    public string Token;
    public string TenantName;
  }

  public class PowerBiTenantDetails : PowerBiTenant {
    public IList<Report> Reports { get; set; }
    public IList<Dataset> Datasets { get; set; }
    public IList<GroupUser> Members { get; set; }
  }

  public class PowerBiServiceApi {

    private readonly AppOwnsDataDBService AppOwnsDataDBService;
    private readonly IConfiguration Configuration;
    private readonly IWebHostEnvironment Env;

    private ITokenAcquisition tokenAcquisition { get; }
    private string urlPowerBiServiceApiRoot { get; }
    private string targetCapacityId { get; }
    private PowerBIClient pbiClient { get; set; }

    public PowerBiServiceApi(IConfiguration configuration, ITokenAcquisition tokenAcquisition, AppOwnsDataDBService AppOwnsDataDBService, IWebHostEnvironment env) {
      this.Configuration = configuration;
      this.urlPowerBiServiceApiRoot = configuration["PowerBi:ServiceRootUrl"];
      this.targetCapacityId = configuration["PowerBi:TargetCapacityId"];
      this.tokenAcquisition = tokenAcquisition;
      this.AppOwnsDataDBService = AppOwnsDataDBService;
      this.Env = env;
      pbiClient = GetPowerBiClient();
    }

    public const string powerbiApiDefaultScope = "https://analysis.windows.net/powerbi/api/.default";

    public string GetAccessToken() {
      return this.tokenAcquisition.GetAccessTokenForAppAsync(powerbiApiDefaultScope).Result;
    }

    public PowerBIClient GetPowerBiClient() {
      var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
      return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
    }

    public async Task<EmbeddedReportViewModel> GetReport(Guid WorkspaceId, Guid ReportId) {
      var pbiClient = GetPowerBiClient();
      var report = await pbiClient.Reports.GetReportInGroupAsync(WorkspaceId, ReportId);
      var datasetId = report.DatasetId;
      var tokenRequest = new GenerateTokenRequest(TokenAccessLevel.View, datasetId);
      var embedTokenResponse = await pbiClient.Reports.GenerateTokenAsync(WorkspaceId, ReportId, tokenRequest);
      var embedToken = embedTokenResponse.Token;

      return new EmbeddedReportViewModel {
        ReportId = report.Id.ToString(),
        EmbedUrl = report.EmbedUrl,
        Name = report.Name,
        Token = embedToken
      };
    }

    public Dataset GetDataset(Guid WorkspaceId, string DatasetName) {
      var pbiClient = GetPowerBiClient();
      var datasets = pbiClient.Datasets.GetDatasetsInGroup(WorkspaceId).Value;
      foreach (var dataset in datasets) {
        if (dataset.Name.Equals(DatasetName)) {
          return dataset;
        }
      }
      return null;
    }

    public async Task<IList<Group>> GetTenantWorkspaces() {
      var pbiClient = GetPowerBiClient();
      var workspaces = (await pbiClient.Groups.GetGroupsAsync()).Value;
      return workspaces;
    }

    public PowerBiTenant OnboardNewTenant(PowerBiTenant tenant) {
      var pbiClient = GetPowerBiClient();
      Guid workspaceId = new Guid(tenant.WorkspaceId);

      // Verify that the workspace exists and the service principal has access
      var workspaces = pbiClient.Groups.GetGroups().Value;
      var workspace = workspaces.FirstOrDefault(g => g.Id == workspaceId);
      if (workspace == null) {
        throw new ApplicationException($"Workspace with ID {tenant.WorkspaceId} was not found or the Service Principal does not have access to it.");
      }

      tenant.WorkspaceUrl = "https://app.powerbi.com/groups/" + workspace.Id.ToString() + "/";
      return tenant;
    }

    public PowerBiTenantDetails GetTenantDetails(PowerBiTenant tenant) {
      var pbiClient = GetPowerBiClient();
      Guid workspaceId = new Guid(tenant.WorkspaceId);

      return new PowerBiTenantDetails {
        Name = tenant.Name,
        Created = tenant.Created,
        WorkspaceId = tenant.WorkspaceId,
        WorkspaceUrl = tenant.WorkspaceUrl,
        Members = pbiClient.Groups.GetGroupUsers(workspaceId).Value,
        Datasets = pbiClient.Datasets.GetDatasetsInGroup(workspaceId).Value,
        Reports = pbiClient.Reports.GetReportsInGroup(workspaceId).Value
      };
    }

    public void DeleteTenant(PowerBiTenant tenant) {
      // No physical workspace deletion for existing Fabric workspaces
    }

    public async Task<EmbeddedReportViewModel> GetReportEmbeddingData(PowerBiTenant Tenant, string reportId = null) {
      var pbiClient = GetPowerBiClient();
      Guid workspaceId = new Guid(Tenant.WorkspaceId);
      var reports = (await pbiClient.Reports.GetReportsInGroupAsync(workspaceId)).Value;
      if (reports.Count == 0) {
        throw new ApplicationException("No reports found in workspace " + Tenant.WorkspaceId);
      }
      
      Microsoft.PowerBI.Api.Models.Report report;
      if (!string.IsNullOrEmpty(reportId)) {
        Guid reportGuid = new Guid(reportId);
        report = reports.FirstOrDefault(r => r.Id == reportGuid);
        if (report == null) {
          throw new ApplicationException($"Report {reportId} not found in workspace {Tenant.WorkspaceId}");
        }
      } else {
        report = reports.First();
      }

      var datasetRequests = new List<GenerateTokenRequestV2Dataset> {
        new GenerateTokenRequestV2Dataset(report.DatasetId)
      };

      var reportRequests = new List<GenerateTokenRequestV2Report> {
        new GenerateTokenRequestV2Report(report.Id, allowEdit: false)
      };

      GenerateTokenRequestV2 tokenRequest = new GenerateTokenRequestV2 {
        Datasets = datasetRequests,
        Reports = reportRequests
      };

      string embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest).Token;

      return new EmbeddedReportViewModel {
        ReportId = report.Id.ToString(),
        Name = report.Name,
        EmbedUrl = report.EmbedUrl,
        Token = embedToken,
        TenantName = Tenant.Name
      };
    }

  }

}