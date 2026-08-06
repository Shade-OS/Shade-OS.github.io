# ============================================================================
#  ShadeOS - marka varliklari uretici
#
#  Kaynak: ShadeOS projesinin gercek marka dosyalari (MARK_SRC / ICO_SRC).
#  Uretilenler:
#     public/favicon.ico             <- projedeki .ico aynen kopyalanir
#     public/mark-512.png            <- projedeki isaret aynen kopyalanir
#     public/icon-192.png            <- seffaf, kucultulmus
#     public/apple-touch-icon.png    <- 180x180, koyu zemin (iOS seffaflik sevmez)
#     public/icon-maskable-512.png   <- guvenli alan bosluklu, koyu zemin
#     public/og.png                  <- 1200x630 sosyal medya onizlemesi
#
#  Bu dosya bilerek saf ASCII'dir: Windows PowerShell 5.1 BOM'suz .ps1
#  dosyalarini sistem ANSI kod sayfasiyla okur ve Turkce karakterleri bozar.
#  Tum Turkce metin scripts/og-text.json icinden UTF-8 okunur.
#
#  Calistir:  npm run brand
# ============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public'
$t = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'og-text.json') | ConvertFrom-Json

# --- kaynak marka dosyalari (ShadeOS ana projesi) ---------------------------
$MARK_SRC = 'C:\Users\shades\Desktop\ShadeOS\cleanmgr\assets\gen\mark-512.png'
$ICO_SRC = 'C:\Users\shades\Desktop\ShadeOS\cleanmgr\assets\gen\shadeos.ico'

foreach ($p in @($MARK_SRC, $ICO_SRC)) {
  if (-not (Test-Path $p)) { throw "Marka dosyasi bulunamadi: $p" }
}

# ------------------------------------------------------- marka paleti ------
function C([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

$cBg = C 255 0 0 0          # sayfa zemini
$cPanel = C 255 11 11 18       # ikon zemini
$cFg = C 255 236 236 240
$cFg2 = C 255 154 154 168
$cFg3 = C 255 90 90 106
$cAccent = C 255 157 148 216     # #9D94D8  marka moru
$cAccent2 = C 255 149 188 227     # #95BCE3  marka mavisi
$cTint = C 255 218 213 240     # #DAD5F0  acik ton
$cWarn = C 255 240 182 120
$cLine = C 255 26 26 36
$cChrome = C 255 16 16 24
$cGrid = C 13 255 255 255

# ------------------------------------------------------------ yardimci ----
function NewCanvas([int]$w, [int]$h) {
  $b = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  return @{ Bitmap = $b; Graphics = $g }
}

function SavePng($bitmap, [string]$name) {
  $path = Join-Path $outDir $name
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host ("  {0,-26} {1}x{2}" -f $name, $bitmap.Width, $bitmap.Height)
}

$mark = New-Object System.Drawing.Bitmap($MARK_SRC)

# ================================================== 1) ham kopyalar ========
Write-Host 'marka dosyalari:'
Copy-Item $ICO_SRC (Join-Path $outDir 'favicon.ico') -Force
Write-Host ("  {0,-26} kopyalandi" -f 'favicon.ico')
Copy-Item $MARK_SRC (Join-Path $outDir 'mark-512.png') -Force
Write-Host ("  {0,-26} kopyalandi" -f 'mark-512.png')

# ================================================== 2) icon-192 (seffaf) ===
$c = NewCanvas 192 192
$c.Graphics.DrawImage($mark, 0, 0, 192, 192)
SavePng $c.Bitmap 'icon-192.png'
$c.Graphics.Dispose(); $c.Bitmap.Dispose()

# ============================================ 3) apple-touch-icon (opak) ===
# iOS seffafligi siyaha cevirir; zemini bilerek biz veriyoruz.
$c = NewCanvas 180 180
$c.Graphics.Clear($cPanel)
$c.Graphics.DrawImage($mark, 14, 14, 152, 152)
SavePng $c.Bitmap 'apple-touch-icon.png'
$c.Graphics.Dispose(); $c.Bitmap.Dispose()

# ==================================== 4) maskable 512 (guvenli alan %60) ===
# Android ikonu daire/karo seklinde kirpar; isaret ortada %60'lik alanda kalir.
$c = NewCanvas 512 512
$c.Graphics.Clear($cPanel)
$inset = 102
$c.Graphics.DrawImage($mark, $inset, $inset, (512 - 2 * $inset), (512 - 2 * $inset))
SavePng $c.Bitmap 'icon-maskable-512.png'
$c.Graphics.Dispose(); $c.Bitmap.Dispose()

# =========================================================== 5) og.png =====
$W = 1200
$H = 630
$c = NewCanvas $W $H
$g = $c.Graphics
$g.Clear($cBg)

# izgara
$penGrid = New-Object System.Drawing.Pen($cGrid, 1)
for ($x = 0; $x -lt $W; $x += 68) { $g.DrawLine($penGrid, $x, 0, $x, $H) }
for ($y = 0; $y -lt $H; $y += 68) { $g.DrawLine($penGrid, 0, $y, $W, $y) }
$penGrid.Dispose()

# iki tonlu hale: solda mor, sagda mavi (logonun iki rengi)
function Glow([int]$cx, [int]$cy, [int]$r, $color, [int]$alpha) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $p.AddEllipse(($cx - $r), ($cy - $r), (2 * $r), (2 * $r))
  $br = New-Object System.Drawing.Drawing2D.PathGradientBrush($p)
  $br.CenterColor = (C $alpha $color.R $color.G $color.B)
  $br.SurroundColors = @((C 0 $color.R $color.G $color.B))
  $g.FillPath($br, $p)
  $br.Dispose(); $p.Dispose()
}
# Alfa dusuk tutulur: 8-bit genis gecislerde bantlanma gorunur hale gelir.
Glow 300 40 620 $cAccent 44
Glow 980 320 480 $cAccent2 18

# fircalar
$bFg = New-Object System.Drawing.SolidBrush($cFg)
$bFg2 = New-Object System.Drawing.SolidBrush($cFg2)
$bFg3 = New-Object System.Drawing.SolidBrush($cFg3)
$bAccent = New-Object System.Drawing.SolidBrush($cAccent)
$bAccent2 = New-Object System.Drawing.SolidBrush($cAccent2)
$bTint = New-Object System.Drawing.SolidBrush($cTint)
$bWarn = New-Object System.Drawing.SolidBrush($cWarn)
$bChrome = New-Object System.Drawing.SolidBrush($cChrome)
$bLine = New-Object System.Drawing.SolidBrush($cLine)

$fmt = [System.Drawing.StringFormat]::GenericTypographic

# fontlar
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

function Advance($font) {
  return $g.MeasureString('M', $font, [System.Drawing.PointF]::Empty, $fmt).Width
}

function DrawTracked([string]$text, $font, $brush, [single]$x, [single]$y, [single]$track) {
  $adv = Advance $font
  $cx = $x
  foreach ($ch in $text.ToCharArray()) {
    $g.DrawString([string]$ch, $font, $brush, $cx, $y, $fmt)
    $cx += $adv + $track
  }
}

$M = 80

# ust satir: marka isareti + ~/shadeos
$g.DrawImage($mark, $M, 40, 68, 68)
$fSmall = NewFont 24 'regular'
$g.DrawString($t.brand, $fSmall, $bFg3, ($M + 78), 62, $fmt)

# ana baslik
$fTitle = NewFont 112 'bold'
$g.DrawString($t.title, $fTitle, $bFg, ($M - 6), 178, $fmt)

# vurgu cizgisi: mor -> mavi gecis (logonun iki rengi)
$barRect = New-Object System.Drawing.RectangleF($M, 326, 268, 4)
$barBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $barRect, $cAccent, $cAccent2, 0.0)
$g.FillRectangle($barBrush, $barRect)
$barBrush.Dispose()

# slogan
$fTag = NewFont 36 'bold'
$g.DrawString($t.tagline, $fTag, $bFg, $M, 360, $fmt)

# aciklama
$fDesc = NewFont 22 'regular'
$descBox = New-Object System.Drawing.RectangleF($M, 420, 540, 90)
$g.DrawString($t.description, $fDesc, $bFg2, $descBox, $fmt)

# alt ayirac + yasal uyari
$g.FillRectangle($bLine, $M, 540, ($W - 2 * $M), 1)
$fLegal = NewFont 19 'regular'
$g.FillRectangle($bWarn, $M, 576, 3, 16)
DrawTracked $t.disclaimer $fLegal $bFg3 ($M + 16) 572 1.6

# ------------------------------------------------- sag taraf: terminal ----
$tx = 700
$ty = 150
$tw = 420
$th = 300
$bar = 40

$bTermBg = New-Object System.Drawing.SolidBrush((C 255 8 8 14))
$g.FillRectangle($bTermBg, $tx, $ty, $tw, $th)
$penTerm = New-Object System.Drawing.Pen($cLine, 1)
$g.DrawRectangle($penTerm, $tx, $ty, $tw, $th)

$g.FillRectangle($bChrome, ($tx + 1), ($ty + 1), ($tw - 1), $bar)
$g.DrawLine($penTerm, $tx, ($ty + $bar), ($tx + $tw), ($ty + $bar))

$bDot = New-Object System.Drawing.SolidBrush((C 255 38 38 47))
for ($i = 0; $i -lt 3; $i++) {
  $g.FillEllipse($bDot, ($tx + 16 + $i * 16), ($ty + 16), 9, 9)
}
$fTermTitle = NewFont 16 'regular'
$g.DrawString($t.terminalTitle, $fTermTitle, $bFg3, ($tx + 78), ($ty + 12), $fmt)

# baslik altinda mor -> mavi tarama cizgisi
$sweepRect = New-Object System.Drawing.RectangleF(($tx + 40), ($ty + $bar), 150, 1)
$sweepBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $sweepRect, $cAccent, $cAccent2, 0.0)
$g.FillRectangle($sweepBrush, $sweepRect)
$sweepBrush.Dispose()

$fTerm = NewFont 17 'regular'
$adv = Advance $fTerm
$lineY = $ty + $bar + 26
foreach ($ln in $t.terminalLines) {
  switch ($ln.tone) {
    'cmd' { $tagBrush = $bAccent; $textBrush = $bFg }
    'out' { $tagBrush = $bWarn; $textBrush = $bFg }
    default { $tagBrush = $bTint; $textBrush = $bFg2 }
  }
  $g.DrawString($ln.tag, $fTerm, $tagBrush, ($tx + 22), $lineY, $fmt)
  $g.DrawString($ln.text, $fTerm, $textBrush, ($tx + 22 + ($ln.tag.Length + 1) * $adv), $lineY, $fmt)
  $lineY += 30
}
$g.FillRectangle($bAccent, ($tx + 22), ($lineY + 4), 9, 18)
$penTerm.Dispose()

Write-Host 'sosyal medya gorseli:'
SavePng $c.Bitmap 'og.png'
$g.Dispose(); $c.Bitmap.Dispose()

foreach ($b in @($bFg, $bFg2, $bFg3, $bAccent, $bAccent2, $bTint, $bWarn, $bChrome, $bLine, $bTermBg, $bDot)) {
  $b.Dispose()
}
$mark.Dispose()
Write-Host 'tamam.'
