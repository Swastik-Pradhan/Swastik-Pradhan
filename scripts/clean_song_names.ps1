# PowerShell script to clean song file names
# This script removes the "[SPOTDOWNLOADER.COM]" prefix from all song files

$musicDir = "public/music"

# Check if the directory exists
if (!(Test-Path $musicDir)) {
    Write-Host "Music directory not found: $musicDir"
    exit 1
}

# Get all MP3 files in the directory
$files = Get-ChildItem -Path $musicDir -Filter "*.mp3"

Write-Host "Found $($files.Count) MP3 files to rename..."

foreach ($file in $files) {
    $oldName = $file.Name
    $newName = $oldName -replace "^\[SPOTDOWNLOADER\.COM\]\s*", ""
    
    # Only rename if the name actually changed
    if ($oldName -ne $newName) {
        $oldPath = $file.FullName
        $newPath = Join-Path $musicDir $newName
        
        try {
            Rename-Item -Path $oldPath -NewName $newName
            Write-Host "Renamed: $oldName -> $newName"
        }
        catch {
            Write-Host "Error renaming $oldName : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "No change needed for: $oldName"
    }
}

Write-Host "Song name cleaning completed!" 