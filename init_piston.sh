# clone and enter repo
git clone https://github.com/engineer-man/piston

# Install all the dependencies for the cli
cd piston/cli && npm i && cd -

echo "Installing Piston language packages..."
#install python, sql, node, bash, java
echo "Installing the Python language packages..."
piston/cli/index.js ppman install python 

echo "Installing the SQL language packages..."
piston/cli/index.js ppman install sqlite3

echo "Installing the Node language packages..."
piston/cli/index.js ppman install node

echo "Installing the Bash language packages..."
piston/cli/index.js ppman install bash

echo "Installing the Java language packages..."
piston/cli/index.js ppman install java