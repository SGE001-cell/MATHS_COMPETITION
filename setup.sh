#!/bin/bash
echo "🔧 Installing dependencies offline-style..."
mkdir -p node_modules

# Download tarballs (prebuilt package files)
pkg install wget -y

wget https://registry.npmjs.org/express/-/express-4.18.2.tgz -O express.tgz
wget https://registry.npmjs.org/body-parser/-/body-parser-1.20.2.tgz -O body-parser.tgz
wget https://registry.npmjs.org/cors/-/cors-2.8.5.tgz -O cors.tgz
wget https://registry.npmjs.org/dotenv/-/dotenv-16.3.1.tgz -O dotenv.tgz
wget https://registry.npmjs.org/multer/-/multer-1.4.5-lts.1.tgz -O multer.tgz
wget https://registry.npmjs.org/nodemon/-/nodemon-3.0.1.tgz -O nodemon.tgz

# Extract each package into node_modules
for file in *.tgz; do
    mkdir -p node_modules/${file%%-*}
    tar -xzf "$file" -C node_modules/${file%%-*} --strip-components=1
done

echo "✅ node_modules installed!"