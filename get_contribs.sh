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

echo "# Contributions listed by branch" > "$FILE_NAME"

for branch in $(git branch -r --list "${PREFIX}*main"); do
    echo "## Contributors for branch: $branch" >> "$FILE_NAME"
    git fame --branch="$branch" -s --show-email --sort=commits --format=md >> "$FILE_NAME"
done
