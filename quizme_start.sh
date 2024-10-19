#!/bin/bash

git clone https://github.com/Ahmed-Rushdi/Quizme
cd Quizme

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

docker compose up -d

/bin/bash init_piston.sh