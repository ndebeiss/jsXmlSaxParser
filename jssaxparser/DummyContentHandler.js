/* sax 2 methods
 void 	attributeDecl(java.lang.String eName, java.lang.String aName, java.lang.String type, java.lang.String mode, java.lang.String value)
          Report an attribute type declaration.
 void 	comment(char[] ch, int start, int length)
          Report an XML comment anywhere in the document.
 void 	elementDecl(java.lang.String name, java.lang.String model)
          Report an element type declaration.
 void 	endCDATA()
          Report the end of a CDATA section.
 void 	endDTD()
          Report the end of DTD declarations.
 void 	endEntity(java.lang.String name)
          Report the end of an entity.
 void 	externalEntityDecl(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
          Report a parsed external entity declaration.
 InputSource 	getExternalSubset(java.lang.String name, java.lang.String baseURI)
          Tells the parser that if no external subset has been declared in the document text, none should be used.
 void 	internalEntityDecl(java.lang.String name, java.lang.String value)
          Report an internal entity declaration.
 InputSource 	resolveEntity(java.lang.String publicId, java.lang.String systemId)
          Invokes EntityResolver2.resolveEntity() with null entity name and base URI.
 InputSource 	resolveEntity(java.lang.String name, java.lang.String publicId, java.lang.String baseURI, java.lang.String systemId)
          Tells the parser to resolve the systemId against the baseURI and read the entity text from that resulting absolute URI.
 void 	startCDATA()
          Report the start of a CDATA section.
 void 	startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
          Report the start of DTD declarations, if any.
 void 	startEntity(java.lang.String name)
          Report the beginning of some internal and external XML entities.
*/


// Begin namespace
(function () {

/* Private static helper function */

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function _displayAtts (atts) {
    for (var i = 0 ; i < atts.getLength() ; i++) {
        this.div.innerHTML += "attribute [" + atts.getURI(i) + "] [" + atts.getLocalName(i) + "] [" + atts.getValue(i) + "]<br/>";
    }
}

function _serializeSaxParseException (saxParseException) {
    this.div.innerHTML += "invalid char : [" + saxParseException.ch + "] at index : " + saxParseException.index + "<br/>";
    this.div.innerHTML += "message is : [" + saxParseException.message + "]<br/>";
    if (saxParseException.exception) {
        this.div.innerHTML += "wrapped exception is : [" + _serializeSaxParseException.call(this, saxParseException.exception) + "]<br/>";
    }
}


function DummyContentHandler(div) {
    
    this.div = div;
    
}

// INTERFACE: ContentHandler: http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
// implemented in DefaultHandler, DefaultHandler2:
//  http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html and
//  http://www.saxproject.org/apidoc/org/xml/sax/ext/DefaultHandler2.html
DummyContentHandler.prototype.startDocument = function() {
    this.div.innerHTML += "startDocument<br/>";
};

DummyContentHandler.prototype.startElement = function(namespaceURI, localName, qName, atts) {
    this.div.innerHTML += "startElement [" + namespaceURI + "] [" + localName + "] [" + qName + "]<br/>";
    _displayAtts.call(this, atts);
};

DummyContentHandler.prototype.endElement = function(namespaceURI, localName, qName) {
    this.div.innerHTML += "endElement [" + namespaceURI + "] [" + localName + "] [" + qName + "]<br/>";
};

DummyContentHandler.prototype.startPrefixMapping = function(prefix, uri) {
    this.div.innerHTML += "startPrefixMapping [" + prefix + "] [" + uri + "]<br/>";
};

DummyContentHandler.prototype.endPrefixMapping = function(prefix) {
    this.div.innerHTML += "endPrefixMapping [" + prefix + "]<br/>";
};

DummyContentHandler.prototype.processingInstruction = function(target, data) {
    this.div.innerHTML += "processingInstruction [" + target + "] [" + data + "]<br/>";
};

DummyContentHandler.prototype.ignorableWhitespace = function(ch, start, length) {
    this.div.innerHTML += "ignorableWhitespace [" + ch + "] [" + start + "] [" + length + "]<br/>";
};

DummyContentHandler.prototype.characters = function(ch, start, length) {
    this.div.innerHTML += "characters [" + ch + "] [" + start + "] [" + length + "]<br/>";
};

DummyContentHandler.prototype.skippedEntity = function(name) {
    this.div.innerHTML += "skippedEntity [" + name + "]<br/>";
};

DummyContentHandler.prototype.endDocument = function() {
    this.div.innerHTML += "endDocument";
};

DummyContentHandler.prototype.setDocumentLocator = function (locator) {
    this.div.innerHTML += 'locator';
};


// INTERFACE: DeclHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html

DummyContentHandler.prototype.attributeDecl = function(eName, aName, type, mode, value) {
    this.div.innerHTML += "attributeDecl [" + eName + "] [" + aName + "] [" + type + "] [" + mode + "] [" + value + "]<br/>";
};

DummyContentHandler.prototype.elementDecl = function(name, model) {
    this.div.innerHTML += "elementDecl [" + name + "] [" + model + "]<br/>";
};

DummyContentHandler.prototype.externalEntityDecl = function(name, publicId, systemId) {
    this.div.innerHTML += "externalEntityDecl [" + name + "] [" + publicId + "] [" + systemId + "]<br/>";
};

DummyContentHandler.prototype.internalEntityDecl = function(name, value) {
    this.div.innerHTML += "internalEntityDecl [" + name + "] [" + value + "]<br/>";
};

// INTERFACE: LexicalHandler: http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html

DummyContentHandler.prototype.comment = function(ch, start, length) {
    this.div.innerHTML += "comment [" + ch + "] [" + start + "] [" + length + "]<br/>";
};

DummyContentHandler.prototype.endCDATA = function() {
    this.div.innerHTML += "endCDATA<br/>";
};

DummyContentHandler.prototype.endDTD = function() {
    this.div.innerHTML += "endDTD<br/>";
};

DummyContentHandler.prototype.endEntity = function(name) {
    this.div.innerHTML += "endEntity [" + name + "]<br/>";
};

DummyContentHandler.prototype.startCDATA = function() {
    this.div.innerHTML += "startCDATA<br/>";
};

DummyContentHandler.prototype.startDTD = function(name, publicId, systemId) {
    this.div.innerHTML += "startDTD [" + name + "] [" + publicId + "] [" + systemId + "]<br/>";
};

DummyContentHandler.prototype.startEntity = function(name) {
    this.div.innerHTML += "startEntity [" + name + "]<br/>";
};

// INTERFACE: EntityResolver: http://www.saxproject.org/apidoc/org/xml/sax/EntityResolver.html
// Could implement this by checking for last two arguments missing in EntityResolver2 resolveEntity() below
// DummyContentHandler.prototype.resolveEntity = function (publicId, systemId) {};

// INTERFACE: EntityResolver2: http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
DummyContentHandler.prototype.resolveEntity = function(name, publicId, baseURI, systemId) {
    this.div.innerHTML += "resolveEntity [" + name + "] [" + publicId + "] [" +baseURI + "] [" + systemId + "]<br/>";
};
DummyContentHandler.prototype.getExternalSubset = function(name, baseURI) {
    this.div.innerHTML += "getExternalSubset [" + name + "] [" + baseURI + "]<br/>";
};

// INTERFACE: DTDHandler: http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
DummyContentHandler.prototype.notationDecl = function (name, publicId, systemId) {
    this.div.innerHTML += "name[" + name + "] [" + publicId + "] [" + systemId + "]<br/>";
};
DummyContentHandler.prototype.unparsedEntityDecl = function (name, publicId, systemId, notationName) {
    this.div.innerHTML += "name[" + name + "] [" + publicId + "] [" + systemId + "] [" + notationName + "]<br/>";
};

// INTERFACE: ErrorHandler: http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
DummyContentHandler.prototype.warning = function(saxParseException) {
    _serializeSaxParseException.call(this, saxParseException);
};
DummyContentHandler.prototype.error = function(saxParseException) {
    _serializeSaxParseException.call(this, saxParseException);
};
DummyContentHandler.prototype.fatalError = function(saxParseException) {
    _serializeSaxParseException.call(this, saxParseException);
};



// EXPORT
this.DummyContentHandler = DummyContentHandler;

}());