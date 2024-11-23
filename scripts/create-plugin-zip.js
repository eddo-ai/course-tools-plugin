const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create output directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Create a file to write our zip to
const output = fs.createWriteStream('dist/eddolearning-course-tools.zip');
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

// Add the main plugin file
archive.file('eddolearning-course-tools.php', { name: 'eddolearning-course-tools.php' });

// Add the build directory
archive.directory('build/', 'build');

// Add the vendor directory
archive.directory('vendor/', 'vendor');

// Add any other necessary files/directories
archive.file('readme.txt', { name: 'readme.txt' });

// Finalize the archive
archive.finalize(); 