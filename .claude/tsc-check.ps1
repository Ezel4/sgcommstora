$input_json = $input | Out-String | ConvertFrom-Json
$file_path = $input_json.tool_input.file_path
if ($file_path -match '\.(tsx?|ts)$') {
  Set-Location 'c:/Users/muham/OneDrive/Sigmood commerce ai/front'
  $result = npx tsc --noEmit 2>&1
  if ($LASTEXITCODE -ne 0) {
    $msg = ($result -join "`n") -replace '"', "'"
    Write-Output "{`"systemMessage`": `"TypeScript errors detectes:`n$msg`"}"
  }
}
