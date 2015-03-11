/*global SAXParseException */
(function () { // Begin namespace
    

// Overridable handlers which ignore all parsing events (though see resolveEntity() and fatalError())

// http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
function DefaultHandler () {
    this.saxParseExceptions = [];
}
// INTERFACE: ContentHandler: http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
DefaultHandler.prototype.startDocument = function() {
};

DefaultHandler.prototype.startElement = function(namespaceURI, localName, qName, atts) {
};

DefaultHandler.prototype.endElement = function(namespaceURI, localName, qName) {
};

DefaultHandler.prototype.startPrefixMapping = function(prefix, uri) {
};

DefaultHandler.prototype.endPrefixMapping = function(prefix) {
};

DefaultHandler.prototype.processingInstruction = function(target, data) {
};

DefaultHandler.prototype.ignorableWhitespace = function(ch, start, length) {
};

DefaultHandler.prototype.characters = function(ch, start, length) {
};

DefaultHandler.prototype.skippedEntity = function(name) {
};

DefaultHandler.prototype.endDocument = function() {
};

DefaultHandler.prototype.setDocumentLocator = function (locator) {
    this.locator = locator;
};
// INTERFACE: EntityResolver: http://www.saxproject.org/apidoc/org/xml/sax/EntityResolver.html
// Could implement this by checking for last two arguments missing in EntityResolver2 resolveEntity() below
DefaultHandler.prototype.resolveEntity = function (publicId, systemId) {
    return null;
};

// INTERFACE: DTDHandler: http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
DefaultHandler.prototype.notationDecl = function (name, publicId, systemId) {
};
DefaultHandler.prototype.unparsedEntityDecl = function (name, publicId, systemId, notationName) {
};

// INTERFACE: ErrorHandler: http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
DefaultHandler.prototype.warning = function(saxParseException) {
    this.saxParseExceptions.push(saxParseException);
};
DefaultHandler.prototype.error = function(saxParseException) {
    this.saxParseExceptions.push(saxParseException);
};
DefaultHandler.prototype.fatalError = function(saxParseException) {
    throw saxParseException;
};


// http://www.saxproject.org/apidoc/org/xml/sax/ext/DefaultHandler2.html
function DefaultHandler2 () {
    DefaultHandler.call(this);
}
DefaultHandler2.prototype = new DefaultHandler();

// INTERFACE: DeclHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html

DefaultHandler2.prototype.attributeDecl = function(eName, aName, type, mode, value) {
};

DefaultHandler2.prototype.elementDecl = function(name, model) {
};

DefaultHandler2.prototype.externalEntityDecl = function(name, publicId, systemId) {
};

DefaultHandler2.prototype.internalEntityDecl = function(name, value) {
};

// INTERFACE: LexicalHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html

DefaultHandler2.prototype.comment = function(ch, start, length) {
};

DefaultHandler2.prototype.endCDATA = function() {
};

DefaultHandler2.prototype.endDTD = function() {
};

DefaultHandler2.prototype.endEntity = function(name) {
};

DefaultHandler2.prototype.startCDATA = function() {
};

DefaultHandler2.prototype.startDTD = function(name, publicId, systemId) {
};

DefaultHandler2.prototype.startEntity = function(name) {
};
// INTERFACE: EntityResolver: http://www.saxproject.org/apidoc/org/xml/sax/EntityResolver.html
// Could implement this by checking for last two arguments missing in EntityResolver2 resolveEntity() below
// DefaultHandler2.prototype.resolveEntity = function (publicId, systemId) {};
// INTERFACE: EntityResolver2: http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
DefaultHandler2.prototype.resolveEntity = function(name, publicId, baseURI, systemId) {
};
DefaultHandler2.prototype.getExternalSubset = function(name, baseURI) {
};



// Could put on org.xml.sax.helpers.
this.DefaultHandler = DefaultHandler;

// Could put on org.xml.sax.ext.
this.DefaultHandler2 = DefaultHandler2;

}()); // end namespace