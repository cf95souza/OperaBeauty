const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace /admin/ with /staff/admin/
    content = content.replace(/\/\$\{tenant_slug\}\/admin\//g, '/${tenant_slug}/staff/admin/');
    
    // Replace /agenda-profissional with /staff/agenda-profissional
    content = content.replace(/\/\$\{tenant_slug\}\/agenda-profissional/g, '/${tenant_slug}/staff/agenda-profissional');
    
    // Replace /ficha-cliente with /staff/ficha-cliente
    content = content.replace(/\/\$\{tenant_slug\}\/ficha-cliente/g, '/${tenant_slug}/staff/ficha-cliente');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
};

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (filepath.endsWith('.jsx')) {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const files = walkSync(directoryPath);
files.forEach(replaceInFile);

console.log('Done rewriting links in components.');
