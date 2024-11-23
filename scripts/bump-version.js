const fs = require( 'fs' );
const path = require( 'path' );

// Read package.json
const packagePath = path.join( __dirname, '..', 'package.json' );
const package = require( packagePath );

// Get current version
const [ major, minor, patch ] = package.version.split( '.' ).map( Number );

// Increment patch version
const newVersion = `${ major }.${ minor }.${ patch + 1 }`;
package.version = newVersion;

// Write back to package.json
fs.writeFileSync( packagePath, JSON.stringify( package, null, 4 ) + '\n' );

// Update PHP file
const phpPath = path.join( __dirname, '..', 'eddolearning-course-tools.php' );
let phpContent = fs.readFileSync( phpPath, 'utf8' );

// Replace version in PHP header
phpContent = phpContent.replace(
	/Version:\s*\d+\.\d+\.\d+/,
	`Version: ${ newVersion }`
);

// Write back to PHP file
fs.writeFileSync( phpPath, phpContent );

// Write version to GitHub Actions environment file
fs.appendFileSync( process.env.GITHUB_ENV, `NEW_VERSION=${ newVersion }\n` );

console.log(
	`Version bumped to ${ newVersion } in both package.json and PHP file`
);
