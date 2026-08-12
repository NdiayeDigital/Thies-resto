$lines = Get-Content 'app.js'
$part1 = $lines | Select-Object -First 470
$part2 = $lines | Select-Object -Skip 2821
$part1 + $part2 | Set-Content -Encoding UTF8 'app.js'
