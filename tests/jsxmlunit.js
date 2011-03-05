/*global assertEquals, data_of, assertTrue, is_ignorable  */
/*
Copyright or © or Copr. Nicolas Debeissat, Brett Zamir

nicolas.debeissat@gmail.com (http://debeissat.nicolas.free.fr/) brettz9@yahoo.com

This software is a computer program whose purpose is to parse XML
files respecting SAX2 specifications.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software. You can use,
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info".

As a counterpart to the access to the source code and rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty and the software's author, the holder of the
economic rights, and the successive licensors have only limited
liability.

In this respect, the user's attention is drawn to the risks associated
with loading, using, modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean that it is complicated to manipulate, and that also
therefore means that it is reserved for developers and experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or
data to be ensured and, more generally, to use and operate it in the
same conditions as regards security.

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.

*/

/* comes from https://developer.mozilla.org/En/Code_snippets/LookupNamespaceURI */
function lookupNamespaceURI (node, prefix) { // adapted directly from http://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespaceURIAlgo
	var htmlMode = document.contentType; 
    var xmlnsPattern = /^xmlns:(.*)$/;
    if (node.lookupNamespaceURI && htmlMode !== 'text/html') {
        return node.lookupNamespaceURI(prefix);
    }
    switch (node.nodeType) {
        case 1: // ELEMENT_NODE (could also just test for Node.ELEMENT_NODE, etc., if supported in all browsers)
            if (node.namespaceURI !== null && node.prefix === prefix)  {
            // Note: prefix could be "null" in this case we are looking for default namespace
                return node.namespaceURI;
            }
            if (node.attributes.length) {
                for (var i=0; i < node.attributes.length; i++) {
                    var att = node.attributes[i];
                    xmlnsPattern.lastIndex = 0; 
                    if (att.name.search(xmlnsPattern) !== -1 && xmlnsPattern.exec(att.name)[1] === prefix) {
                        if (att.value) {
                            return att.value;
                        }
                        return null; // unknown
                    }
                    else if (att.name === 'xmlns' && prefix === null) {
                    // default namespace
                        if (att.value) {
                            return att.value;
                        }
                        return null; // unknown
                    }
                }
            }
            if (node.parentNode) {
            // EntityReferences may have to be skipped to get to it
                return lookupNamespaceURI(node.parentNode, prefix);
            }
            return null;
        case 9: // DOCUMENT_NODE
        case 6: // ENTITY_NODE
        case 12: // NOTATION_NODE
        case 10: // DOCUMENT_TYPE_NODE
        case 11: // DOCUMENT_FRAGMENT_NODE
            return null; // unknown
        case 2: // ATTRIBUTE_NODE
            if (node.ownerElement) {
                return lookupNamespaceURI(node.ownerElement, prefix);
            }
            else {
                return null; // unknown
            }
        default:
            // TEXT_NODE (3), CDATA_SECTION_NODE (4), ENTITY_REFERENCE_NODE (5),
            // PROCESSING_INSTRUCTION_NODE (7), COMMENT_NODE (8)
            if (node.parentNode) {
            // EntityReferences may have to be skipped to get to it
                return lookupNamespaceURI(node.parentNode, prefix);
            }
            else {
                return null; // unknown
            }
    }
}

function assertAttributesEquals(attsExpected, attsResult) {
    var i, j;
    for (i = 0 ; i < attsExpected.length ; i++) {
        var attExpected = attsExpected.item(i);
        var attFound = false;
        for (j = 0 ; j < attsResult.length && !attFound; j++) {
            var attResult = attsResult.item(j);
            if (attExpected.nodeName === attResult.nodeName && lookupNamespaceURI(attExpected, attExpected.prefix) === lookupNamespaceURI(attResult, attResult.prefix)) {
                attFound = true;
                assertXmlEquals(attExpected, attResult);
            }
        }
        assertTrue("missing attribute " + attExpected.nodeName, attFound);
    }
}

function assertXmlEquals(expected, result) {
    var i;
    assertEquals("different nodes types", expected.nodeType, result.nodeType);
    switch(expected.nodeType) {
        case 1: //element nodes
            assertEquals("different node names", expected.nodeName, result.nodeName);
            var attsExpected = expected.attributes;
            var attsResult = result.attributes;
            //remove namespaces declaration from attributes, not supported
            for (i = 0 ; i < attsExpected.length ; i++) {
                var attExpected = attsExpected.item(i);
                if (/^xmlns/.test(attExpected.nodeName)) {
                    expected.removeAttributeNode(attExpected);
                    i--;
                }
            }
            for (i = 0 ; i < attsResult.length ; i++) {
                var attResult = attsResult.item(i);
                if (/^xmlns/.test(attResult.nodeName)) {
                    result.removeAttributeNode(attResult);
                    i--;
                }
            }
            assertEquals("different number of attributes on node " + result.nodeName, attsExpected.length, attsResult.length);
            assertAttributesEquals(attsExpected, attsResult);
            var childNodesExpected = expected.childNodes;
            var childNodesResult = result.childNodes;
            //remove ignorables child nodes
            for (i = 0 ; i < childNodesExpected.length ; i++) {
                var childNodeExpected = childNodesExpected.item(i);
                if (is_ignorable(childNodeExpected)) {
                    expected.removeChild(childNodeExpected);
                    i--;
                }
            }
            for (i = 0 ; i < childNodesResult.length ; i++) {
                var childNodeResult = childNodesResult.item(i);
                if (is_ignorable(childNodeResult)) {
                    result.removeChild(childNodeResult);
                    i--;
                }
            }
            assertEquals("different number of children nodes under " + result.nodeName, childNodesExpected.length, childNodesResult.length);
            for (i = 0 ; i < childNodesExpected.length ; i++) {
                assertXmlEquals(childNodesExpected.item(i), childNodesResult.item(i));
            }
            break;
        case 3: //text nodes
            assertEquals("different text content", data_of(expected), data_of(result));
            break;
        case 4: //CDATA nodes
            assertEquals("different content in CDATA", data_of(expected), data_of(result));
            break;
        case 8: //comment nodes
            assertEquals("different content of comment", data_of(expected), data_of(result));
            break;
        case 9: //document
            var expectedDocument = expected.documentElement;
            var resultDocument = result.documentElement;
            //firefox splits long text nodes for example.
            expectedDocument.normalize();
            resultDocument.normalize();
            assertXmlEquals(expectedDocument, resultDocument);
            break;
        // Fix: Need test cases for the following node types (at least the ones implemented)
        case 2: // attribute node
            assertEquals("invalid value of attribute " + result.nodeName, expected.value, result.value);
            break;
        case 5: // entity reference node
        case 6: // entity node
        case 7: // processing instruction node
        case 10: // document type node
        case 11: // document fragment node
        case 12: // notation node
        default:
            throw 'Node type not supported in jsxmlunit test';
    }
}
