$lines = [System.IO.File]::ReadAllLines((Join-Path $PWD 'app.js'))
$adminLines = New-Object System.Collections.Generic.List[string]
$appLines = New-Object System.Collections.Generic.List[string]

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -ge 470 -and $i -le 2820) {
        $adminLines.Add($lines[$i])
    } else {
        $appLines.Add($lines[$i])
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($False)
[System.IO.File]::WriteAllLines((Join-Path $PWD 'js\admin.js'), $adminLines, $utf8NoBom)
[System.IO.File]::WriteAllLines((Join-Path $PWD 'app.js'), $appLines, $utf8NoBom)
