const { google } = require("googleapis");
const { read } = require("original-fs");
const fsPromises = require('fs').promises;
const { create } = require('domain');
const { ipcRenderer, dialog } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { text } = require('stream/consumers');
const axios = require('axios');


//Code Mirror
const CodeMirror = require('codemirror');
const { basicSetup } = require("@codemirror/basic-setup");
const { autocompletion } = require("@codemirror/autocomplete");
require('codemirror/lib/codemirror');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/hint/show-hint');


//C C++ Java
require('codemirror/mode/clike/clike');

// JavaScript
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/hint/javascript-hint');

// HTML
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/mode/xml/xml');  
require('codemirror/addon/hint/html-hint');

// CSS
require('codemirror/mode/css/css');
require('codemirror/addon/hint/css-hint');

// Python 
require('codemirror/mode/python/python');

// PHP 
require('codemirror/mode/php/php');

// Ruby 
require('codemirror/mode/ruby/ruby');

// Another Languages
require('codemirror/mode/go/go');
require('codemirror/mode/sql/sql');
require('codemirror/mode/shell/shell');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/yaml/yaml');
require('codemirror/mode/javascript/javascript'); 
require('codemirror/mode/haskell/haskell'); 
require('codemirror/mode/dart/dart'); 
require('codemirror/mode/groovy/groovy'); 
require('codemirror/mode/vhdl/vhdl'); 
require('codemirror/mode/verilog/verilog'); 
require('codemirror/mode/clojure/clojure'); 
require('codemirror/mode/swift/swift'); 
require('codemirror/mode/rust/rust'); 
require('codemirror/mode/elm/elm'); 
require('codemirror/mode/crystal/crystal'); 
require('codemirror/mode/r/r'); 
require('codemirror/mode/d/d'); 
require('codemirror/mode/tcl/tcl'); 
require('codemirror/mode/powershell/powershell'); 
require('codemirror/mode/xml/xml'); 

// Autocomplete
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/addon/hint/html-hint');
require('codemirror/addon/hint/css-hint');
require('codemirror/keymap/sublime.js');

const port = 2222;
let savesDir;

//spotify
const spotifyClientSecret = '';
const spotifyClientId = '';

//global variables
const driveCheckbox = document.querySelector('.save-drive-checkbox');

const home = `
    <h1></h1>
`;