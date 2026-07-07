param(
  [int]$Port = 5173,
  [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
$rootPath = [System.IO.Path]::GetFullPath($Root)
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$listener.Start()

$localIps = [System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces() |
  Where-Object { $_.OperationalStatus -eq [System.Net.NetworkInformation.OperationalStatus]::Up } |
  ForEach-Object { $_.GetIPProperties().UnicastAddresses } |
  Where-Object {
    $_.Address.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and
    -not $_.Address.ToString().StartsWith("127.") -and
    -not $_.Address.ToString().StartsWith("169.254.")
  } |
  ForEach-Object { $_.Address.ToString() }

Write-Host "Serving $rootPath"
Write-Host "Computer: http://localhost:$Port/"
foreach ($ip in $localIps) {
  Write-Host "Phone on same Wi-Fi: http://$ip`:$Port/"
}
Write-Host "Press Ctrl+C to stop."

function Get-MimeType([string]$Path) {
  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8"; break }
    ".css" { "text/css; charset=utf-8"; break }
    ".js" { "application/javascript; charset=utf-8"; break }
    ".json" { "application/json; charset=utf-8"; break }
    ".png" { "image/png"; break }
    ".jpg" { "image/jpeg"; break }
    ".jpeg" { "image/jpeg"; break }
    ".svg" { "image/svg+xml; charset=utf-8"; break }
    default { "application/octet-stream"; break }
  }
}

function Send-Response($Stream, [int]$StatusCode, [string]$StatusText, [byte[]]$Body, [string]$ContentType) {
  $headers = @(
    "HTTP/1.1 $StatusCode $StatusText",
    "Content-Type: $ContentType",
    "Content-Length: $($Body.Length)",
    "Cache-Control: no-cache",
    "Connection: close",
    "",
    ""
  ) -join "`r`n"

  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  $Stream.Write($Body, 0, $Body.Length)
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $buffer = New-Object byte[] 8192
    $read = $stream.Read($buffer, 0, $buffer.Length)
    if ($read -le 0) {
      continue
    }

    $request = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
    $requestLine = ($request -split "`r?`n", 2)[0]
    $parts = $requestLine -split " "
    if ($parts.Length -lt 2 -or $parts[0] -ne "GET") {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Method Not Allowed")
      Send-Response $stream 405 "Method Not Allowed" $bytes "text/plain; charset=utf-8"
      continue
    }

    $pathOnly = ($parts[1] -split "\?", 2)[0]
    $requestPath = [Uri]::UnescapeDataString($pathOnly.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootPath, $requestPath))
    if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
      Send-Response $stream 403 "Forbidden" $bytes "text/plain; charset=utf-8"
    } elseif (-not [System.IO.File]::Exists($fullPath)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      Send-Response $stream 404 "Not Found" $bytes "text/plain; charset=utf-8"
    } else {
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      Send-Response $stream 200 "OK" $bytes (Get-MimeType $fullPath)
    }
  } catch {
    try {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("Server Error")
      Send-Response $stream 500 "Server Error" $bytes "text/plain; charset=utf-8"
    } catch {}
  } finally {
    $client.Close()
  }
}
