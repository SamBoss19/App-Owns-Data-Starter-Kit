# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY AppOwnsDataShared/AppOwnsDataShared.csproj AppOwnsDataShared/
COPY AppOwnsDataAdmin/AppOwnsDataAdmin.csproj AppOwnsDataAdmin/
RUN dotnet restore AppOwnsDataAdmin/AppOwnsDataAdmin.csproj

COPY AppOwnsDataShared/ AppOwnsDataShared/
COPY AppOwnsDataAdmin/ AppOwnsDataAdmin/
RUN dotnet publish AppOwnsDataAdmin/AppOwnsDataAdmin.csproj -c Release -o /app/publish

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AppOwnsDataAdmin.dll"]
