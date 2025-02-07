#!/bin/bash

# Hardcoded input file and output directory
mkdir -p "favicons"

# Sizes to create
convert "logo.png" -resize 16x16 "favicons/favicon-16x16.png"
echo "Created favicons/favicon-16x16.png"

convert "logo.png" -resize 32x32 "favicons/favicon-32x32.png"
echo "Created favicons/favicon-32x32.png"

convert "logo.png" -resize 48x48 "favicons/favicon-48x48.png"
echo "Created favicons/favicon-48x48.png"

convert "logo.png" -resize 128x128 "favicons/favicon-128x128.png"
echo "Created favicons/favicon-128x128.png"

# Create the favicon.ico file with all sizes combined
convert "favicons/favicon-16x16.png" "favicons/favicon-32x32.png" "favicons/favicon-48x48.png" "favicons/favicon-128x128.png" "favicons/favicon.ico"
echo "Created favicon.ico"


