$ErrorActionPreference = "Stop"
$InputPath = "C:\Users\deren\Downloads\Dyadic_v25_1.xlsx"
$OutputPath = ".\data\conflict_dyadic_summary.json"

function Get-CellValue {
  param(
    $Cell,
    [string[]]$SharedStrings
  )

  if (-not $Cell) {
    return ""
  }

  $value = if ($Cell.v) { [string]$Cell.v } else { "" }
  if ($Cell.t -eq "s" -and $value -match '^\d+$') {
    return $SharedStrings[[int]$value]
  }
  return $value
}

function Add-UniqueValue {
  param(
    [System.Collections.Generic.HashSet[string]]$Set,
    [string]$Value
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return
  }

  $normalized = $Value.Trim()
  if ($normalized.Length -gt 0) {
    [void]$Set.Add($normalized)
  }
}

if (-not (Test-Path $InputPath)) {
  throw "No se encontró el archivo Dyadic: $InputPath"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $InputPath))

try {
  $sharedStrings = @()
  $sharedEntry = $zip.Entries | Where-Object { $_.FullName -eq "xl/sharedStrings.xml" }
  if ($sharedEntry) {
    $reader = [System.IO.StreamReader]::new($sharedEntry.Open())
    try {
      $xml = [xml]$reader.ReadToEnd()
      foreach ($si in $xml.sst.si) {
        if ($si.t) {
          $sharedStrings += [string]$si.t
        } else {
          $parts = @()
          foreach ($r in $si.r) {
            $parts += [string]$r.t
          }
          $sharedStrings += ($parts -join "")
        }
      }
    } finally {
      $reader.Close()
    }
  }

  $sheetEntry = $zip.Entries | Where-Object { $_.FullName -eq "xl/worksheets/sheet1.xml" }
  if (-not $sheetEntry) {
    throw "No se encontró xl/worksheets/sheet1.xml en $InputPath"
  }

  $reader = [System.IO.StreamReader]::new($sheetEntry.Open())
  try {
    $sheetXml = [xml]$reader.ReadToEnd()
  } finally {
    $reader.Close()
  }

  $rows = @($sheetXml.worksheet.sheetData.row)
  if ($rows.Count -lt 2) {
    throw "El archivo no trae filas suficientes para construir el resumen"
  }

  $headers = @()
  foreach ($cell in $rows[0].c) {
    $headers += (Get-CellValue -Cell $cell -SharedStrings $sharedStrings)
  }

  $conflicts = @{}
  $recordCount = 0

  foreach ($row in ($rows | Select-Object -Skip 1)) {
    $cells = @($row.c)
    if ($cells.Count -eq 0) {
      continue
    }

    $record = @{}
    for ($index = 0; $index -lt $headers.Count; $index++) {
      $record[$headers[$index]] = if ($index -lt $cells.Count) {
        Get-CellValue -Cell $cells[$index] -SharedStrings $sharedStrings
      } else {
        ""
      }
    }

    $conflictId = [string]$record.conflict_id
    if ([string]::IsNullOrWhiteSpace($conflictId)) {
      continue
    }

    if (-not $conflicts.ContainsKey($conflictId)) {
      $conflicts[$conflictId] = [ordered]@{
        conflictId = $conflictId
        locations = [System.Collections.Generic.HashSet[string]]::new()
        regions = [System.Collections.Generic.HashSet[string]]::new()
        sideA = [System.Collections.Generic.HashSet[string]]::new()
        sideB = [System.Collections.Generic.HashSet[string]]::new()
        territoryNames = [System.Collections.Generic.HashSet[string]]::new()
        incompatibilities = [System.Collections.Generic.HashSet[string]]::new()
        conflictTypes = [System.Collections.Generic.HashSet[string]]::new()
        intensityLevels = [System.Collections.Generic.HashSet[string]]::new()
        startYear = $null
        endYear = $null
        version = [string]$record.version
        rows = 0
      }
    }

    $entry = $conflicts[$conflictId]
    $recordCount += 1
    $entry.rows += 1

    Add-UniqueValue -Set $entry.locations -Value ([string]$record.location)
    Add-UniqueValue -Set $entry.regions -Value ([string]$record.region)
    Add-UniqueValue -Set $entry.sideA -Value ([string]$record.side_a)
    Add-UniqueValue -Set $entry.sideB -Value ([string]$record.side_b)
    Add-UniqueValue -Set $entry.territoryNames -Value ([string]$record.territory_name)
    Add-UniqueValue -Set $entry.incompatibilities -Value ([string]$record.incompatibility)
    Add-UniqueValue -Set $entry.conflictTypes -Value ([string]$record.type_of_conflict)
    Add-UniqueValue -Set $entry.intensityLevels -Value ([string]$record.intensity_level)

    foreach ($side in ([string]$record.side_a_2nd -split ',')) {
      Add-UniqueValue -Set $entry.sideA -Value $side
    }
    foreach ($side in ([string]$record.side_b_2nd -split ',')) {
      Add-UniqueValue -Set $entry.sideB -Value $side
    }

    $year = 0
    if ([int]::TryParse([string]$record.year, [ref]$year)) {
      if (-not $entry.startYear -or $year -lt $entry.startYear) {
        $entry.startYear = $year
      }
      if (-not $entry.endYear -or $year -gt $entry.endYear) {
        $entry.endYear = $year
      }
    }
  }

  $summary = [ordered]@{
    generatedAt = (Get-Date).ToString("s")
    source = "UCDP Dyadic Dataset v25.1"
    inputFile = (Resolve-Path $InputPath).Path
    recordCount = $recordCount
    conflictCount = $conflicts.Count
    conflicts = @(
      $conflicts.Values |
        Sort-Object { [int]$_.conflictId } |
        ForEach-Object {
          [ordered]@{
            conflictId = $_.conflictId
            startYear = $_.startYear
            endYear = $_.endYear
            rows = $_.rows
            locations = @($_.locations | Sort-Object)
            regions = @($_.regions | Sort-Object)
            sideA = @($_.sideA | Sort-Object)
            sideB = @($_.sideB | Sort-Object)
            territoryNames = @($_.territoryNames | Sort-Object)
            incompatibilities = @($_.incompatibilities | Sort-Object)
            conflictTypes = @($_.conflictTypes | Sort-Object)
            intensityLevels = @($_.intensityLevels | Sort-Object)
            version = $_.version
          }
        }
    )
  }

  $json = $summary | ConvertTo-Json -Depth 8
  Set-Content -Path $OutputPath -Value $json -Encoding utf8
  Write-Output "Resumen dyadic generado: $OutputPath ($($summary.conflictCount) conflictos, $($summary.recordCount) filas)"
} finally {
  $zip.Dispose()
}
