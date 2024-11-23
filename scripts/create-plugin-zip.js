const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Plugin name - used as the root directory in the ZIP
const PLUGIN_NAME = 'eddolearning-course-tools';

// Create output directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Create a file to write our zip to
const output = fs.createWriteStream(`dist/${PLUGIN_NAME}.zip`);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
    console.log('Archive created successfully');
    console.log(archive.pointer() + ' total bytes');
});

// Handle warnings and errors
archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function(err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files with the plugin directory as root
const addFile = (filename) => {
    archive.file(filename, { name: `${PLUGIN_NAME}/${filename}` });
};

const addDirectory = (dirname) => {
    archive.directory(dirname, `${PLUGIN_NAME}/${dirname}`);
};

// Add the main plugin file
addFile('eddolearning-course-tools.php');

// Add the build directory
addDirectory('build');

// Add the vendor directory
addDirectory('vendor');

// Add any other necessary files
addFile('readme.txt');

// Add composer files
addFile('composer.json');
if (fs.existsSync('composer.lock')) {
    addFile('composer.lock');
}

// Finalize the archive
archive.finalize(); 