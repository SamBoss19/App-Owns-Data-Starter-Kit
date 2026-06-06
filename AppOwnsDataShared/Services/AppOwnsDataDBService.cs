using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AppOwnsDataShared.Models;

namespace AppOwnsDataShared.Services {

  public class AppOwnsDataDBService {

    private readonly AppOwnsDataDB dbContext;

    public AppOwnsDataDBService(AppOwnsDataDB context) {
      dbContext = context;
    }

    public string GetNextTenantName() {
      var appNames = dbContext.Tenants.Select(tenant => tenant.Name).ToList();
      string baseName = "Tenant";
      string nextName;
      int counter = 0;
      do {
        counter += 1;
        nextName = baseName + counter.ToString("00");
      }
      while (appNames.Contains(nextName));
      return nextName;
    }

    public void OnboardNewTenant(PowerBiTenant tenant) {
      tenant.Created = DateTime.Now;
      dbContext.Tenants.Add(tenant);
      dbContext.SaveChanges();
    }

    public IList<PowerBiTenant> GetTenants() {
      return dbContext.Tenants
             .Select(tenant => tenant)
             .OrderBy(tenant => tenant.Name)
             .ToList();
    }

    public PowerBiTenant GetTenant(string TenantName) {
      var tenant = dbContext.Tenants.Where(tenant => tenant.Name == TenantName).First();
      return tenant;
    }

    public void DeleteTenant(PowerBiTenant tenant) {

      // unassign any users in the tenant
      var tenantUsers = dbContext.Users.Where(user => user.TenantName == tenant.Name);
      foreach (var user in tenantUsers) {
        user.TenantName = "";
        dbContext.Users.Update(user);
      }
      dbContext.SaveChanges();

      // delete the tenant
      dbContext.Tenants.Remove(tenant);
      dbContext.SaveChanges();
      return;
    }

    public IList<User> GetUsers() {
      return dbContext.Users
             .Select(user => user)
             .OrderByDescending(user => user.LastLogin)
             .ToList();
    }

    public User GetUser(string LoginId) {
      var user = dbContext.Users.FirstOrDefault(user => user.LoginId.ToLower() == LoginId.ToLower());
      if (user == null) {
        // Auto-create user on first request to allow admin mapping in UI
        user = new User {
          LoginId = LoginId,
          UserName = LoginId.Contains("@") ? LoginId.Split('@')[0] : LoginId,
          Created = DateTime.Now,
          LastLogin = DateTime.Now,
          CanEdit = false,
          CanCreate = false,
          TenantAdmin = false
        };
        dbContext.Users.Add(user);
        dbContext.SaveChanges();
      }
      return user;
    }

    public User UpdateUser(User currentUser) {
      var user = dbContext.Users.FirstOrDefault(u => u.LoginId.ToLower() == currentUser.LoginId.ToLower());
      if (user == null) {
        user = new User {
          LoginId = currentUser.LoginId,
          Created = DateTime.Now
        };
        dbContext.Users.Add(user);
      }
      user.UserName = currentUser.UserName;
      user.CanEdit = currentUser.CanEdit;
      user.CanCreate = currentUser.CanCreate;
      user.TenantName = currentUser.TenantName;
      user.AllowedReportIds = currentUser.AllowedReportIds;
      dbContext.SaveChanges();
      return user;
    }

    public User CreateUser(User newUser) {
      var user = dbContext.Users.FirstOrDefault(u => u.LoginId.ToLower() == newUser.LoginId.ToLower());
      bool isNew = false;
      if (user == null) {
        user = new User();
        user.Created = DateTime.Now;
        user.LoginId = newUser.LoginId;
        isNew = true;
      }
      user.UserName = !string.IsNullOrEmpty(newUser.UserName) ? newUser.UserName : user.UserName;
      user.TenantName = !string.IsNullOrEmpty(newUser.TenantName) ? newUser.TenantName : user.TenantName;
      user.CanEdit = newUser.CanEdit;
      user.CanCreate = newUser.CanCreate;
      user.AllowedReportIds = newUser.AllowedReportIds;
      user.LastLogin = DateTime.Now;
      if (isNew) {
        dbContext.Users.Add(user);
      }
      dbContext.SaveChanges();
      return user;
    }

    public void DeleteUser(User user) {
      dbContext.Users.Remove(user);
      dbContext.SaveChanges();
      return;
    }

    public List<ActivityLogEntry> GetActivityLog() {
      return this.dbContext.ActivityLog
        .OrderByDescending(entry => entry.Created).Take(50)
        .ToList();
    }

    public ActivityLogEntry GetActivityLogEntry(int id) {
      return this.dbContext.ActivityLog.Find(id);
    }

    public ActivityLogEntry PostActivityLogEntry(ActivityLogEntry activityLogEntry) {
      activityLogEntry.Created = DateTime.Now;
      activityLogEntry.WorkspaceId = (dbContext.Tenants.Where(tenant => tenant.Name == activityLogEntry.Tenant).First()).WorkspaceId;
      dbContext.ActivityLog.Add(activityLogEntry);
      dbContext.SaveChanges();
      return activityLogEntry;
    }

    public void ProcessUserLogin(User currentUser) {
      var existingUser = dbContext.Users.FirstOrDefault(user => user.LoginId.ToLower() == currentUser.LoginId.ToLower());
      if (existingUser != null) {
        existingUser.LastLogin = DateTime.Now;
        if (!string.IsNullOrEmpty(currentUser.UserName)) {
          existingUser.UserName = currentUser.UserName;
        }
        dbContext.SaveChanges();
      }
      else {
        currentUser.Created = DateTime.Now;
        currentUser.LastLogin = DateTime.Now;
        currentUser.CanEdit = false;
        currentUser.CanCreate = false;
        currentUser.TenantAdmin = false;
        dbContext.Users.Add(currentUser);
        dbContext.SaveChanges();
      }
    }
  }

}
