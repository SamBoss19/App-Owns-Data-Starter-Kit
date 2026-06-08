# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj files first so 'dotnet restore' is cached across code changes.
COPY AppOwnsDataShared/AppOwnsDataShared.csproj AppOwnsDataShared/
COPY AppOwnsDataWebApi/AppOwnsDataWebApi.csproj AppOwnsDataWebApi/
RUN dotnet restore AppOwnsDataWebApi/AppOwnsDataWebApi.csproj

# Copy the rest of the sources needed by the Web API + shared lib.
COPY AppOwnsDataShared/ AppOwnsDataShared/
COPY AppOwnsDataWebApi/ AppOwnsDataWebApi/
RUN dotnet publish AppOwnsDataWebApi/AppOwnsDataWebApi.csproj -c Release -o /app/publish

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AppOwnsDataWebApi.dll"]
