/*global SAXNotSupportedException */
(function () { // Begin namespace

/* Supporting functions and exceptions */
/*
FIELDS
static java.lang.String 	NSDECL
          The namespace declaration URI as a constant.
static java.lang.String 	XMLNS
          The XML Namespace URI as a constant.

Method Summary
 boolean 	declarePrefix(java.lang.String prefix, java.lang.String uri)
          Declare a Namespace prefix.
 java.util.Enumeration 	getDeclaredPrefixes()
          Return an enumeration of all prefixes declared in this context.
 java.lang.String 	getPrefix(java.lang.String uri)
          Return one of the prefixes mapped to a Namespace URI.
 java.util.Enumeration 	getPrefixes()
          Return an enumeration of all prefixes whose declarations are active in the current context.
 java.util.Enumeration 	getPrefixes(java.lang.String uri)
          Return an enumeration of all prefixes for a given URI whose declarations are active in the current context.
 java.lang.String 	getURI(java.lang.String prefix)
          Look up a prefix and get the currently-mapped Namespace URI.
 boolean 	isNamespaceDeclUris()
          Returns true if namespace declaration attributes are placed into a namespace.
 void 	popContext()
          Revert to the previous Namespace context.
 java.lang.String[] 	processName(java.lang.String qName, java.lang.String[] parts, boolean isAttribute)
          Process a raw XML qualified name, after all declarations in the current context have been handled by declarePrefix().
 void 	pushContext()
          Start a new Namespace context.
 void 	reset()
          Reset this Namespace support object for reuse.
 void 	setNamespaceDeclUris(boolean value)
          Controls whether namespace declaration attributes are placed into the NSDECL namespace by processName().
 **/

// http://www.saxproject.org/apidoc/org/xml/sax/SAXException.html
function PrefixNotFoundException(prefix) { // java.lang.Exception
    this.prefix = prefix;
}
 
// Note: Try to adapt for internal use, as well as offer for external app
// http://www.saxproject.org/apidoc/org/xml/sax/helpers/NamespaceSupport.html
function NamespaceSupport () {
}

NamespaceSupport.prototype.declarePrefix = function (prefix, uri) {
    var namespacesOfThatLevel = this.namespaces[this.namespaces.length - 1];
    namespacesOfThatLevel[prefix] = uri;
};
NamespaceSupport.prototype.getDeclaredPrefixes = function () {
    var declaredPrefixes = [];
    var i = this.namespaces.length;
    while (i--) {
        for (var prefix in this.namespaces[i]) {
            declaredPrefixes.push(prefix);
        }
    }
    return declaredPrefixes;
};
NamespaceSupport.prototype.getPrefix = function (uri) {
    var i = this.namespaces.length;
    while (i--) {
        var namespacesOfThatLevel = this.namespaces[i];
        for (var prefix in namespacesOfThatLevel) {
            if (namespacesOfThatLevel[prefix] === uri) {
                return prefix;
            }
        }
    }
    return null;
};
NamespaceSupport.prototype.getPrefixes = function () {
    throw new SAXNotSupportedException("NamespaceSupport.getPrefixes()");
};
NamespaceSupport.prototype.getPrefixes = function (uri) {
    throw new SAXNotSupportedException("NamespaceSupport.getPrefixes(uri)");
};
NamespaceSupport.prototype.getURI = function (prefix) {
    // if attribute, prefix may be null, then namespaceURI is null
    if (prefix === null) {
        return null;
    }
    var i = this.namespaces.length;
    while (i--) {
        var namespaceURI = this.namespaces[i][prefix];
        if (namespaceURI) {
            return namespaceURI;
        }
    }
    //in case default namespace is not declared, prefix is "", namespaceURI is null
    if (!prefix) {
        return null;
    }
    throw new PrefixNotFoundException(prefix);
};

NamespaceSupport.prototype.isNamespaceDeclUris = function () {
    throw new SAXNotSupportedException("NamespaceSupport.isNamespaceDeclUris()");
};
NamespaceSupport.prototype.popContext = function () {
    return this.namespaces.pop();
};
NamespaceSupport.prototype.processName = function (qName, parts, isAttribute) {
    throw new SAXNotSupportedException("NamespaceSupport.processName(qName, parts, isAttribute)");
};
NamespaceSupport.prototype.pushContext = function () {
    var namespacesOfThatLevel = {};
    this.namespaces.push(namespacesOfThatLevel);
};
NamespaceSupport.prototype.reset = function () {
    /* for each depth, a map of namespaces */
    this.namespaces = [];
    var xmlNamespace = {};
    xmlNamespace.xml = NamespaceSupport.XMLNS;
    this.namespaces.push(xmlNamespace);
};
NamespaceSupport.prototype.setNamespaceDeclUris = function (value) {
    throw new SAXNotSupportedException("NamespaceSupport.setNamespaceDeclUris(value)");
};
NamespaceSupport.NSDECL = 'http://www.w3.org/xmlns/2000/'; // NS of xmlns, xmlns:html, etc.
NamespaceSupport.XMLNS = 'http://www.w3.org/XML/1998/namespace'; // e.g., NS for xml:lang, etc.

this.NamespaceSupport = NamespaceSupport;

}()); // end namespace