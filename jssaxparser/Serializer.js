/*global ActiveXObject, window, document */
// Begin namespace
(function () {

function Serializer() {
    this.warnSaxParseExceptions = [];
    this.saxParseExceptions = [];
    this.currentPrefixMapping = {};
    this.string = "";
    //may not be dumped to the XML
    this.dtd = "";
    this.dtdDumped = false;
    //if cdata, then characters must be entified
    this.cdata = false;
}

Serializer.prototype.entify = function entify(str) { // FIX: this is probably too many replaces in some cases and a call to it may not be needed at all in some cases
    //must not replace '&' of entities or character references
    return str.replace(/&(?!(amp;|gt;|lt;|quot;|#))/g, '&amp;').replace(/>/g, '&gt;').replace(new RegExp('<', 'g'), '&lt;').replace(/"/g, '&quot;');
};

Serializer.prototype.startDocument = function() {};

Serializer.prototype.startElement = function(namespaceURI, localName, qName, atts) {
    this.string += '<' + qName;
    //adds namespace attributes
    for (var i in this.currentPrefixMapping) {
        this.string += ' xmlns:' + i + '="' + this.currentPrefixMapping[i] + '"'; // .toLowerCase()
    }
    this.currentPrefixMapping = {};
    for (i = 0 ; i < atts.getLength() ; i++) {
        var value = atts.getValue(i);
        value = value.replace(/\n/g, "&#10;");
        value = value.replace(/\r/g, "&#13;");
        value = value.replace(/\t/g, "&#9;");
        this.string += ' ' + atts.getQName(i) + '="' + value + '"'; // .toLowerCase()
    }
    this.string += '>';
};

Serializer.prototype.endElement = function(namespaceURI, localName, qName) {
    this.string += '</' + qName + '>';
};

Serializer.prototype.startPrefixMapping = function(prefix, uri) {
    this.currentPrefixMapping[prefix] = uri;
};

Serializer.prototype.endPrefixMapping = function(prefix) {};

Serializer.prototype.processingInstruction = function(target, data) {
    data = data.replace(/\r\n/g, "\n");
    this.string += '<?' + target + ' ' + data + '?>';
};

Serializer.prototype.ignorableWhitespace = function(ch, start, length) {
    for (var i = 0; i < ch.length; i++) {
        var charCode = ch.charCodeAt(i);
        if (charCode !== 32) {
            this.string += "&#" + ch.charCodeAt(i) + ";";
        } else {
            this.string += ch.charAt(i);
        }
    }
    //this.string += ch;
};

Serializer.prototype.characters = function(ch, start, length) {
    ch = ch.replace(/\n/g, "&#10;");
    ch = ch.replace(/\r/g, "&#13;");
    ch = ch.replace(/\t/g, "&#9;");
    this.string += this.entify(ch);
};

Serializer.prototype.skippedEntity = function(name) {};

Serializer.prototype.endDocument = function() {};

Serializer.prototype.setDocumentLocator = function (locator) {
    this.locator = locator;
};

// INTERFACE: DeclHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html

Serializer.prototype.attributeDecl = function(eName, aName, type, mode, value) {};

Serializer.prototype.elementDecl = function(name, model) {};

Serializer.prototype.externalEntityDecl = function(name, publicId, systemId) {};

Serializer.prototype.internalEntityDecl = function(name, value) {};

// INTERFACE: LexicalHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
Serializer.prototype.comment = function(ch, start, length) {
    //this.string += '<!-- ' + ch + ' -->';
};

Serializer.prototype.endCDATA = function() {
    //this.string += ']]>';
    this.cdata = false;
};

Serializer.prototype.endDTD = function() {
    if (this.dtdDumped) {
        this.dtd += "]>\n";
        this.string += this.dtd;
    }
};

Serializer.prototype.endEntity = function(name) {};

Serializer.prototype.startCDATA = function() {
    //this.string += '<![CDATA[';
    this.cdata = true;
};

Serializer.prototype.startDTD = function(name, publicId, systemId) {
    this.dtd += '<!DOCTYPE ' + name + " [\n";
};

Serializer.prototype.startEntity = function(name) {};

// Not a standard SAX method
Serializer.prototype.startCharacterReference = function(hex, number) {
    //this.string += '&#' + (hex ? 'x' : '') + number + ';';
};


// INTERFACE: EntityResolver: http://www.saxproject.org/apidoc/org/xml/sax/EntityResolver.html
// Could implement this by checking for last two arguments missing in EntityResolver2 resolveEntity() below
// Serializer.prototype.resolveEntity(publicId, systemId) {};

// INTERFACE: EntityResolver2: http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
Serializer.prototype.resolveEntity = function(name, publicId, baseURI, systemId) {};
Serializer.prototype.getExternalSubset = function(name, baseURI) {};

// INTERFACE: DTDHandler: http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
Serializer.prototype.notationDecl = function (name, publicId, systemId) {
    this.dtdDumped = true;
    this.dtd += '<!NOTATION ' + name;
    if (publicId) {
        this.dtd += " PUBLIC '" + publicId + "'>\n";
    }
    if (systemId) {
        this.dtd += " SYSTEM '" + systemId + "'>\n";
    }
};

Serializer.prototype.unparsedEntityDecl = function (name, publicId, systemId, notationName) {};

// INTERFACE: ErrorHandler: http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
Serializer.prototype.warning = function(saxParseException) {
    this.warnSaxParseExceptions.push(saxParseException);
};
Serializer.prototype.error = function(saxParseException) {
    this.saxParseExceptions.push(saxParseException);
};
Serializer.prototype.fatalError = function(saxParseException) {
    throw saxParseException;
};

// EXPORT
this.Serializer = Serializer;

}());
