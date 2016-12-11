# create dirs 
rm -Rf public
mkdir public
mkdir public/css
mkdir public/dist

# css
cp -R css/* public/css/

# js
webpack
cp -R dist/* public/dist/

# html
cp index.html public/
