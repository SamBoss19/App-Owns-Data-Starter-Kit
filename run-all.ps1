<#
.SYNOPSIS
    Launches the App-Owns-Data Starter Kit (Web API + Admin + React client)
    concurrently, each in its own PowerShell window.

.DESCRIPTION
    No npm packages required. Uses the .NET SDK and Node that are already
    installed on the machine. Each service runs in a separate window so you
    can read its logs and Ctrl+C it independently.

.EXAMPLE
    ./run-all.ps1
    ./run-all.ps1 -Watch      # hot-reload the .NET projects via 'dotnet watch'
#>
param(
    [switch]$Watch
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

# Fail fast with a clear message if prerequisites are missing.
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error "The .NET 6 SDK was not found on PATH. Install it from https://dotnet.microsoft.com/download/dotnet/6.0"
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js / npm was not found on PATH. Install it from https://nodejs.org"
}

# Ensure the local HTTPS dev certificate is trusted (Web API runs on https://localhost:44302).
dotnet dev-certs https --trust | Out-Null

# Restore the React client's node_modules on first run.
if (-not (Test-Path (Join-Path $root "AppOwnsDataReactClient/node_modules"))) {
    Write-Host "Installing React client dependencies (first run)..." -ForegroundColor Yellow
    npm --prefix (Join-Path $root "AppOwnsDataReactClient") install
}

$dotnetVerb = if ($Watch) { "watch --project {0} run" } else { "run --project {0}" }

function Start-Service-Window([string]$title, [string]$command, [string]$workdir) {
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "`$host.UI.RawUI.WindowTitle = '$title'; Set-Location '$workdir'; $command"
    )
}

$api   = "dotnet " + ($dotnetVerb -f "AppOwnsDataWebApi/AppOwnsDataWebApi.csproj")
$admin = "dotnet " + ($dotnetVerb -f "AppOwnsDataAdmin/AppOwnsDataAdmin.csproj")

Start-Service-Window "AOD Web API"  $api   $root
Start-Service-Window "AOD Admin"    $admin $root
Start-Service-Window "AOD React"    "npm start" (Join-Path $root "AppOwnsDataReactClient")

Write-Host ""
Write-Host "All three services are starting in separate windows:" -ForegroundColor Green
Write-Host "  Web API : https://localhost:44302/swagger"
Write-Host "  Admin   : https://localhost:44300"
Write-Host "  React   : http://localhost:5000"
