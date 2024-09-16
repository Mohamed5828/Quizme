# Quizme

## Overview
This repository contains the source code for the **Exam System**, an online exam platform with real-time monitoring and code execution features. The system comprises multiple components, including a React frontend, Django backend, a machine learning service for monitoring, and a Node.js code execution service.

This project was developed as a **graduation project** by a team of students from the **Information Technology Institute (ITI)**.
| Graduation Team |
|---|
| [Ahmed Rushdi](https://github.com/Ahmed-Rushdi) |
| [Eslam Reda](https://github.com/EslamRedaMohamed) |
| [Hossam Elbatal](https://github.com/Hossam-El-Batal) |
| [Khaled Hamouda](https://github.com/KhaledHamouda) |
| [Mohamed Ahmed](https://github.com/Mohamed5828) |



## System Architecture
The project consists of the following components:
1. **Frontend**: React application for students and instructors.
2. **Backend**: Django REST API for handling exams, authentication, and monitoring.
3. **ML Service**: Python (FastAPI) service for real-time anti-cheat monitoring.
4. **Code Execution Service**: Node.js service to securely execute submitted code.
5. **Database**: PostgreSQL database for storing user and exam data.

## Getting Started Instructions
* install [ruff](https://docs.astral.sh/ruff/) for formatting and linting ([vscode extention](https://marketplace.visualstudio.com/items?itemName=charliermarsh.ruff))
* install [poetry](https://python-poetry.org/) for dependency management in python

### 1. Clone the repository

```sh
# If you want to fork then clone the fork url otherwise execute the command below
git clone https://github.com/EslamRedaMohamed/Quizme
cd Quizme
```

### 2. Setup git work-tree for branches of interest

```sh
# git worktree add <directory> <branch-name>
# for example if you are interested in the backend/main and frontend/main branches
git worktree add --lock ./backend -b backend/main
git worktree add --lock ./frontend -b frontend/main

# now if you want to view all work trees and thier checked out branches use
git worktree list 

# list all branches local and remote
git branch -a

# push to remote for the first time
git push -u origin <service>/<feature>
```

### 3. HOW TO: Creating a branch for a feature

```sh
# cd to the base dir of the service you want to add the feature to
# cd <service>
# git checkout -b <service>/<new-feature>
# for example adding user profile to the frontend
cd frontend
git checkout -b frontend/userprofile
```

### 4. HOW TO: Adding services

```sh
# make sure you are in the repo root and on the semi-empty main branch
# git checkout -b <service>/main
# make sure your work is within a nested repo in case we need to fall back to monorepo subdirectories structure
# mkdir <service>
# cd <service>
# do work
# commit

# for example the webcam anti cheat service
git worktree add --lock ./anticheat -b anticheat/main
cd anticheat
# each branch must contain a directory of all of its execlusive contents
mkdir anticheat
cd anticheat
poetry init -q
poetry add opencv-python

```
