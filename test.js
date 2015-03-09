var hilight = require("./index");
require("./languages/javascript");

var syntax = {
    "comment": 4,
    "doctype": 4,
    "cdata": 4,
    "prolog": 4,

    "punctuation": 15,

    "property": 9,
    "tag": 9,
    "boolean": 9,
    "number": 9,
    "constant": 9,
    "symbol": 9,
    "deleted": 9,

    "selector": 11,
    "attr-name": 11,
    "string": 11,
    "char": 11,
    "builtin": 11,
    "inserted": 11,

    "operator": 12,
    "entity": 12,
    "url": 12,

    "atrule": 14,
    "attr-value": 14,
    "keyword": 14,

    "function": 13,

    "regex": 8,
    "important": 8,
    "variable": 8
};

function render(color, str) {
    return "\x1b[38;5;" + color + "m" + str + "\x1b[39m";
}

// single line test
var tokens = [];

hilight.tokenize("javascript",
        "function() { var x = 150; return Math.round(x/7); }", null, tokens);

console.log(hilight.highlight(tokens, syntax, render));

// multiline test
var code = [
    "/**",
    " * Multiline comment",
    " */",
    "function test() {",
    "    var x = 150; // comment",
    "    var y = Math.round(7 / 2);",
    "    for(var i = 0; i < x; ++i) {",
    "       console.log(y * i);",
    "    }",
    "}"
];
var cache = [];

for(var i = 0; i < code.length; ++i) {
    cache[i] = [];
    hilight.tokenize("javascript", code[i], i !== 0 ? cache[i - 1] : null,
            cache[i]);
    console.log(hilight.highlight(cache[i], syntax, render));
}
