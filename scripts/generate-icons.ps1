Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "..\apps\extension\public\icon-128.png"
$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))

foreach ($size in @(16, 48)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $size, $size)
  $out = Join-Path $PSScriptRoot "..\apps\extension\public\icon-$size.png"
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

$img.Dispose()
Write-Host "Generated icon-16.png and icon-48.png"
