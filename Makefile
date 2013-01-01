
# Make all...
all: coffee-files www

# Compile all coffee scripts
coffee-files:
	coffee --bare --compile --output ./libs ./coffee/*

libs:
	mkdir libs

libs/app.js:
	coffee --bare --compile --join ./libs/app.js ./coffee

www: libs/app.js
	cp libs/app.js www/public/js/

# Watch the coffee dir and compile scripts as they change
watch:
	coffee --watch --bare --compile --output ./libs ./coffee

watch-www:
	coffee --watch --bare --compile --join ./www/public/js/app.js ./coffee

# Clean all targets
clean:
	rm -f `ls ./coffee/*.coffee | sed -e 's/\.\/coffee\/\(.*\)\.coffee/\.\/libs\/\1.js/'`
	rm -f www/public/js/app.js
