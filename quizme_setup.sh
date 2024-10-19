#!/bin/bash

set -e

if [[ -d ./Quizme ]]; then
  echo "Quizme directory already exists"
  exit 1
fi

echo "Cloning the Quizme repository..."

git clone https://github.com/Ahmed-Rushdi/Quizme
cd Quizme


echo "Setting up worktrees..."

git worktree add --lock ./backend -b backend/main
git worktree add --lock ./frontend -b frontend/main

cd backend
git branch --set-upstream-to=origin/backend/main backend/main 
git reset --hard origin/backend/main
cd -

cd frontend
git branch --set-upstream-to=origin/frontend/main frontend/main 
git reset --hard origin/frontend/main
cd -


echo "Starting Docker Compose..."

docker compose up -d


echo "Initializing Piston CLI..."

/bin/bash init_piston.sh


echo "Setup completed successfully."