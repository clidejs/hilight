/**
 * Line-wise syntax highlighting module
 * language grammar heavily inspired by http://prismjs.com
 */
var hilight = module.exports = {
    /**
     * Registered languages are stored here
     */
    languages: {},

    /**
     * Function to create a new syntax token
     */
    Token: function(type, content, multiline) {
        return [type, content, multiline];
    },

    // Type index inside a token
    TYPE: 0,
    // Content index inside a token
    CONTENT: 1,
    // Multiline flag index inside a token
    MULTILINE: 2,

    /**
     * Function to register a language
     *
     * @param {String} name language name
     * @param {Array} fileext list of assosiated file-extensions
     * @param {Array} rules list of high-level rules of this language
     */
    registerLanguage: function(name, fileext, rules) {
        if(!rules) {
            rules = fileext;
            fileext = [];
        }

        return hilight.languages[name] = {
            name: name,
            fileext: fileext,
            inner: rules
        };
    },

    /**
     * Function to generate tokens from a code-piece
     *
     * TODO performance improvment (O(n^3) is way to much)
     *
     * @param {String} language language name
     * @param {String} str code-piece to tokenize
     * @param {Array} prev token-array of previouse code-piece, or null
     * @param {Array} tokens token-array to save tokens to
     * @returns Boolean
     */
    tokenize: function(language, str, prev, tokens) {
        var lang = hilight.languages[language];
        if(tokens) {
            // clear array instead of creating a new one
            while(tokens.length > 0) {
                tokens.pop();
            }
        } else {
            tokens = [];
        }

        if(!lang) {
            tokens.push(str);
        } else if(str.length === 0) {
            var last = prev ? prev[prev.length - 1] : null;
            if(last && isArray(last) && last[hilight.MULTILINE]) {
                tokens.push(hilight.Token(last[hilight.TYPE], "",
                        last[hilight.MULTILINE]));
            } else {
                tokens.push("");
            }
        } else {
            var last = prev ? prev[prev.length - 1] : null;
            var text = str;
            var mode = lang.inner;
            var ind = 0;
            var inMultiline = last && last[2] ? last[0] : false;

            for(var i = 0; i < text.length; ++i) {
                for(var m = 0; m < mode.length; ++m) {
                    var found = false;
                    var pattern = mode[m];

                    if(pattern.notafter) {
                        var before = tokens[tokens.length - 1];
                        if(before && before[0] === pattern.notafter.type)
                            continue;
                    }

                    if(pattern.is && !inMultiline) {
                        for(var j = 0; j < pattern.is.length; ++j) {
                            if(text.indexOf(pattern.is[j]) === i) {
                                if(ind !== i)
                                    tokens.push(text.substr(ind, i - ind));
                                tokens.push(hilight.Token(pattern.type,
                                        pattern.is[j], false));
                                i = i + pattern.is[j].length - 1;
                                ind = i + 1;
                                found = true;
                                break;
                            }
                        }
                    } else if(pattern.re && !inMultiline) {
                        pattern.re.lastIndex = i;
                        var match = pattern.re.exec(text);
                        if(match && match.index === i) {
                            if(ind !== i)
                                tokens.push(text.substr(ind, i - ind));
                            tokens.push(hilight.Token(pattern.type, match[0],
                                    false));
                            i = i + match[0].length - 1;
                            ind = i + 1;
                            found = true;
                        }
                    } else if(inMultiline === pattern.type && pattern.end) {
                        for(var j = 0; j < pattern.end.length; ++j) {
                            if(text.indexOf(pattern.end[j]) === i) {
                                i = i + pattern.end[j].length - 1;
                                tokens.push(hilight.Token(pattern.type,
                                        text.substr(ind, i - ind + 1), false));
                                ind = i + 1;
                                found = true;
                                break;
                            }
                        }

                    } else {
                        if(!pattern.begin || inMultiline) continue;

                        for(var j = 0; j < pattern.begin.length; ++j) {
                            if(text.indexOf(pattern.begin[j]) === i) {
                                if(ind !== i)
                                    tokens.push(text.substr(ind, i - ind));

                                if(!pattern.end) {
                                    tokens.push(hilight.Token(pattern.type,
                                            text.substr(i), false));
                                    i = text.length;
                                    ind = i;
                                } else {
                                    inMultiline = pattern.type;
                                    ind = i;
                                    i = i + pattern.begin[j].length - 1;
                                }
                                found = true;
                                break;
                            }
                        }
                    }

                    if(found) break;
                }
            }

            if(ind < text.length) {
                if(inMultiline) {
                    tokens.push(hilight.Token(inMultiline, text.substr(ind),
                            true));
                } else {
                    tokens.push(text.substr(ind));
                }
            }

            return inMultiline;
        }
        return false;
    },

    /**
     * Function to render a string from tokens
     *
     * @param {Array} tokens tokens-array from hilight.tokenize()
     * @param {Object} syntax syntax object
     * @param {Function} render rendering function
     * @returns String
     */
    highlight: function(tokens, syntax, render) {
        var out = "";

        for(var i = 0; i < tokens.length; ++i) {
            var token = tokens[i];
            if(isString(token)) {
                out += token;
            } else {
                if(syntax[token[0]]) {
                    out += render(syntax[token[0]], token[1]);
                } else {
                    out += token[1];
                }
            }
        }

        return out;
    }
};



/**
 * Helpers
 */
var obj = {};
function isArray(a) {
    return obj.toString.call(a) === "[object Array]";
}
function isString(s) {
    return typeof s === "string";
}
