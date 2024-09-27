#!/bin/bash

# Default values
FILE_NAME="contributors.md"
PREFIX="upstream"

# Override defaults if arguments are provided
if [ ! -z "$1" ]; then
    FILE_NAME="$1"
fi

if [ ! -z "$2" ]; then
    PREFIX="$2"
fi

# Get the current date and time
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Write the timestamp and header to the file
{
    echo "# Contributions listed by branch"
    echo "Generated on: $TIMESTAMP"
} > "$FILE_NAME"

for branch in $(git branch -r --list "${PREFIX}*main"); do
    {
	echo "## Contributors for branch: $branch" 
	echo "loc -> surviving lines of code\\"
    } >> "$FILE_NAME"
    git fame --branch="$branch" --enum -e -C -w -M --format=md >> "$FILE_NAME"
done
