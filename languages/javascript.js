var hilight = require("hilight");

var clikecommentmulti = {
    type: "comment",
    begin: ["/*"],
    end: ["*/"]
};
var clikecommentline = {
    type: "comment",
    begin: ["//"]
};
var clikestring = {
    type: "string",
    re: /("|')(\\\n|\\?.)*?\1/g
};
var clikeboolean = {
    type: "boolean",
    is: ("true|false").split("|")
};
var clikeoperator = {
    type: "operator",
    re: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/g
};
var clikepunctuation = {
    type: "punctuation",
    is: ("[|{|}|]|;|(|)|,|.|:").split("|")
};
var clikeclass = {
    type: "class-name",
    re: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
};

var jskeyword = {
    type: "keyword",
    re: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,
    notafter: clikepunctuation
};
var jsnumber = {
    type: "number",
    re: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|-?Infinity)\b/g
};
var jsfunction = {
    type: "function",
    re: /(?!\d)[a-z0-9_$]+(?=\()/ig
};
var jsbuiltin = {
    type: "builtin",
    re: /\b(eval|isFinite|isNaN|parseFloat|parseInt|decideURI|decideURIComponent|encodeURI|encodeURIComponent|escape|unescape|Object|Function|Boolean|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|Number|Math|Date|String|RegExp|Array|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|ArrayBuffer|DataView|JSON|Intl|arguments|require|module|console|window|document)\b/g
};

module.exports = hilight.registerLanguage("javascript", ["js", "json", "es6"], [
    jskeyword,
    jsnumber,
    jsfunction,
    clikecommentline,
    clikecommentmulti,
    clikestring,
    clikeboolean,
    clikeoperator,
    clikeclass,
    clikepunctuation,
    jsbuiltin
]);
