# ============================================================================
#  ShadeOS - sosyal medya onizleme gorseli (og.png) + apple-touch-icon.png
#
#  Bu dosya bilerek saf ASCII tutulmustur: Windows PowerShell 5.1 BOM'suz
#  .ps1 dosyalarini sistem ANSI kod sayfasiyla okur ve Turkce karakterleri
#  bozar. Tum Turkce metin scripts/og-text.json icinden UTF-8 okunur.
#
#  Calistir:  npm run og
# ============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$textPath = Join-Path $PSScriptRoot 'og-text.json'
$outDir = Join-Path $root 'public'
$t = Get-Content -Raw -Encoding UTF8 $textPath | ConvertFrom-Json

# ---------------------------------------------------------------- palet ----
function C([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

$cBg = C 255 0 0 0
$cFg = C 255 236 236 238
$cFg2 = C 255 154 154 164
$cFg3 = C 255 90 90 100
$cAccent = C 255 0 224 138
$cWarn = C 255 255 182 72
$cLine = C 255 26 26 31
$cChrome = C 255 16 16 20
$cGrid = C 12 255 255 255

# ---------------------------------------------------------------- fontlar --
$installed = (New-Object System.Drawing.Text.InstalledFontCollection).Families |
  ForEach-Object { $_.Name }
$familyName = @('Cascadia Mono', 'Consolas', 'Courier New') |
  Where-Object { $installed -contains $_ } |
  Select-Object -First 1
if (-not $familyName) { $familyName = 'Courier New' }
Write-Host "font: $familyName"

function NewFont([single]$size, [string]$style) {
  $fs = [System.Drawing.FontStyle]::Regular
  if ($style -eq 'bold') { $fs = [System.Drawing.FontStyle]::Bold }
  return New-Object System.Drawing.Font(
    $familyName, $size, $fs, [System.Drawing.GraphicsUnit]::Pixel)
}

$fmt = [System.Drawing.StringFormat]::GenericTypographic

# ---------------------------------------------------------- yardimcilar ----
function Advance($g, $font) {
  # Monospace: tek karakterin ilerleme genisligi
  return $g.MeasureString('M', $font, [System.Drawing.PointF]::Empty, $fmt).Width
}

function DrawTracked($g, [string]$text, $font, $brush, [single]$x, [single]$y, [single]$track) {
  $adv = Advance $g $font
  $cx = $x
  foreach ($ch in $text.ToCharArray()) {
    $g.DrawString([string]$ch, $font, $brush, $cx, $y, $fmt)
    $cx += $adv + $track
  }
}

# ============================================================== og.png =====
$W = 1200
$H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$g.Clear($cBg)

# izgara
$penGrid = New-Object System.Drawing.Pen($cGrid, 1)
for ($x = 0; $x -lt $W; $x += 68) { $g.DrawLine($penGrid, $x, 0, $x, $H) }
for ($y = 0; $y -lt $H; $y += 68) { $g.DrawLine($penGrid, 0, $y, $W, $y) }
$penGrid.Dispose()

# ust merkezde mint hale
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(60, -420, 1080, 1080)
$glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glow.CenterColor = (C 58 0 224 138)
$glow.SurroundColors = @((C 0 0 224 138))
$g.FillPath($glow, $glowPath)
$glow.Dispose()
$glowPath.Dispose()

# firca havuzu
$bFg = New-Object System.Drawing.SolidBrush($cFg)
$bFg2 = New-Object System.Drawing.SolidBrush($cFg2)
$bFg3 = New-Object System.Drawing.SolidBrush($cFg3)
$bAccent = New-Object System.Drawing.SolidBrush($cAccent)
$bWarn = New-Object System.Drawing.SolidBrush($cWarn)
$bChrome = New-Object System.Drawing.SolidBrush($cChrome)
$bLine = New-Object System.Drawing.SolidBrush($cLine)

$M = 80  # sol kenar bosluk

# ust satir: ~/shadeos
$fSmall = NewFont 24 'regular'
$g.DrawString($t.brand, $fSmall, $bFg3, $M, 60, $fmt)

# ana baslik
$fTitle = NewFont 112 'bold'
$g.DrawString($t.title, $fTitle, $bFg, ($M - 6), 168, $fmt)

# vurgu cizgisi
$g.FillRectangle($bAccent, $M, 316, 268, 4)

# slogan
$fTag = NewFont 36 'bold'
$g.DrawString($t.tagline, $fTag, $bFg, $M, 352, $fmt)

# aciklama (otomatik sarma)
$fDesc = NewFont 22 'regular'
$descBox = New-Object System.Drawing.RectangleF($M, 412, 540, 90)
$g.DrawString($t.description, $fDesc, $bFg2, $descBox, $fmt)

# alt ayirac + yasal uyari
$g.FillRectangle($bLine, $M, 540, ($W - 2 * $M), 1)
$fLegal = NewFont 19 'regular'
$g.FillRectangle($bWarn, $M, 576, 3, 16)
DrawTracked $g $t.disclaimer $fLegal $bFg3 ($M + 16) 572 1.6

# ------------------------------------------------- sag taraf: terminal ----
$tx = 700
$ty = 150
$tw = 420
$th = 300
$bar = 40

# govde
$bTermBg = New-Object System.Drawing.SolidBrush((C 255 8 8 10))
$g.FillRectangle($bTermBg, $tx, $ty, $tw, $th)
$penTerm = New-Object System.Drawing.Pen($cLine, 1)
$g.DrawRectangle($penTerm, $tx, $ty, $tw, $th)

# baslik cubugu
$g.FillRectangle($bChrome, ($tx + 1), ($ty + 1), ($tw - 1), $bar)
$g.DrawLine($penTerm, $tx, ($ty + $bar), ($tx + $tw), ($ty + $bar))

$bDot = New-Object System.Drawing.SolidBrush((C 255 38 38 45))
for ($i = 0; $i -lt 3; $i++) {
  $g.FillEllipse($bDot, ($tx + 16 + $i * 16), ($ty + 16), 9, 9)
}
$fTermTitle = NewFont 16 'regular'
$g.DrawString($t.terminalTitle, $fTermTitle, $bFg3, ($tx + 78), ($ty + 12), $fmt)

# baslik cubugunun altinda mint tarama cizgisi
$g.FillRectangle($bAccent, ($tx + 40), ($ty + $bar), 150, 1)

# satirlar
$fTerm = NewFont 17 'regular'
$adv = Advance $g $fTerm
$lineY = $ty + $bar + 26
foreach ($ln in $t.terminalLines) {
  switch ($ln.tone) {
    'cmd' { $tagBrush = $bAccent; $textBrush = $bFg }
    'out' { $tagBrush = $bWarn; $textBrush = $bFg }
    default { $tagBrush = $bAccent; $textBrush = $bFg2 }
  }
  $g.DrawString($ln.tag, $fTerm, $tagBrush, ($tx + 22), $lineY, $fmt)
  $g.DrawString($ln.text, $fTerm, $textBrush, ($tx + 22 + ($ln.tag.Length + 1) * $adv), $lineY, $fmt)
  $lineY += 30
}

# yanip sonen imlec
$g.FillRectangle($bAccent, ($tx + 22), ($lineY + 4), 9, 18)

$penTerm.Dispose()

$ogPath = Join-Path $outDir 'og.png'
$bmp.Save($ogPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "yazildi: $ogPath  (${W}x${H})"

# =================================================== apple-touch-icon.png ==
$S = 180
$ico = New-Object System.Drawing.Bitmap($S, $S)
$gi = [System.Drawing.Graphics]::FromImage($ico)
$gi.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gi.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$gi.Clear($cBg)

# ince mint cerceve
$penIco = New-Object System.Drawing.Pen($cAccent, 3)
$penIco.Color = (C 90 0 224 138)
$gi.DrawRectangle($penIco, 6, 6, ($S - 13), ($S - 13))
$penIco.Dispose()

# ust vurgu cubugu
$gi.FillRectangle($bAccent, 44, 34, 92, 6)

# S harfi
$fIco = NewFont 104 'bold'
$sz = $gi.MeasureString('S', $fIco, [System.Drawing.PointF]::Empty, $fmt)
$gi.DrawString('S', $fIco, $bAccent, (($S - $sz.Width) / 2), 52, $fmt)

$icoPath = Join-Path $outDir 'apple-touch-icon.png'
$ico.Save($icoPath, [System.Drawing.Imaging.ImageFormat]::Png)
$gi.Dispose()
$ico.Dispose()
Write-Host "yazildi: $icoPath  (${S}x${S})"

foreach ($b in @($bFg, $bFg2, $bFg3, $bAccent, $bWarn, $bChrome, $bLine, $bTermBg, $bDot)) {
  $b.Dispose()
}
