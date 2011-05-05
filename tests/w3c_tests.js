/*global document, alert, assertTrue, DomContentHandler, JsUnitException , DefaultHandler2, SAXException, textContent, InputSource, Serializer, XMLReaderFactory, diffString, loadFile */
/*
Copyright or © or Copr. Nicolas Debeissat

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

function throwNotFatalException(errorHandler) {
    if (errorHandler.saxParseExceptions.length > 0) {
        throw errorHandler.saxParseExceptions[0];
    }
}

function testParse_xmlconf() {
    var contentHandler = new DomContentHandler();
    contentHandler.setDocumentLocator(new Locator2Impl());
    var saxParser = XMLReaderFactory.createXMLReader();
    saxParser.setFeature('http://apache.org/xml/features/nonvalidating/load-external-dtd', true);
    saxParser.setHandler(contentHandler);
    testCt++;
    try {
        saxParser.parse(new InputSource("xmlconf/xmlconf.xml"));
        throwNotFatalException(saxParser.errorHandler);
    } catch(e) {
        assertTrue(e.message, false);
    }
    xmlConf = contentHandler.document;
}

function parseTestCase(uri, strictChars) {
    var contentHandler2 = new DefaultHandler2();
    contentHandler2.setDocumentLocator(new Locator2Impl());
    var saxParser2 = XMLReaderFactory.createXMLReader();
    saxParser2.setFeature('http://apache.org/xml/features/nonvalidating/load-external-dtd', true);
    saxParser2.setHandler(contentHandler2);
    if (strictChars) {
        saxParser2.setFeature('http://debeissat.nicolas.free.fr/ns/character-data-strict', true);
    }
    try {
        saxParser2.parse(new InputSource(uri));
    } finally {}
    throwNotFatalException(saxParser2.errorHandler);
}


function parseTestCaseError(uri, strictChars) {
    var contentHandler2 = new DefaultHandler2();
    contentHandler2.setDocumentLocator(new Locator2Impl());
    var saxParser2 = XMLReaderFactory.createXMLReader();
    saxParser2.setFeature('http://apache.org/xml/features/nonvalidating/load-external-dtd', true);
    saxParser2.setHandler(contentHandler2);
    if (strictChars) {
        saxParser2.setFeature('http://debeissat.nicolas.free.fr/ns/character-data-strict', true);
    }
    try {
        saxParser2.parse(new InputSource(uri));
    } finally {}
}

function parseTestCase_invalid(uri, strictChars) {
    var contentHandler2 = new DefaultHandler2();
    contentHandler2.setDocumentLocator(new Locator2Impl());
    var saxParser2 = XMLReaderFactory.createXMLReader();
    saxParser2.setHandler(contentHandler2);
    saxParser2.setFeature('http://xml.org/sax/features/validation', true);
    saxParser2.setFeature('http://apache.org/xml/features/nonvalidating/load-external-dtd', true);
    if (strictChars) {
        saxParser2.setFeature('http://debeissat.nicolas.free.fr/ns/character-data-strict', true);
    }
    try {
        saxParser2.parse(new InputSource(uri));
    } finally {}
    throwNotFatalException(saxParser2.errorHandler);
}


function parseTestCase_valid(uri, validOutput, strictChars) {
    var serializer = new Serializer();
    serializer.setDocumentLocator(new Locator2Impl());
    var saxParser2 = XMLReaderFactory.createXMLReader();
    saxParser2.setHandler(serializer);
    saxParser2.setFeature('http://xml.org/sax/features/validation', true);
    saxParser2.setFeature('http://apache.org/xml/features/nonvalidating/load-external-dtd', true);
    saxParser2.setFeature('http://debeissat.nicolas.free.fr/ns/attribute-whitespace-normalization', true);
    if (strictChars) {
        saxParser2.setFeature('http://debeissat.nicolas.free.fr/ns/character-data-strict', true);
    }
    try {
        saxParser2.parse(new InputSource(uri));
    } finally {}
    if (validOutput) {
        var expected = loadFile(validOutput);
        if (expected !== serializer.string) {
            throw new SAXException("serialization output not correct : " + diffString(expected, serializer.string));
        }
    }
    throwNotFatalException(saxParser2.errorHandler);
}

    
function print_total_errs () {  
    var hr = document.createElementNS('http://www.w3.org/1999/xhtml', 'hr');
    var p = document.createElementNS('http://www.w3.org/1999/xhtml', 'p');
    testResultSummary = p.innerHTML = 'Total test failures: '+failedCt+'; Total not supported notices: '+notSupportedCt+'; Total tests: '+testCt;
    p.style.border = 'solid black 2px';
    p.style.fontSize = '20px';
    document.getElementById('outputDiv').appendChild(hr);
    document.getElementById('outputDiv').appendChild(p);
}

function prepareTestParse(testCaseId) {
    if (!xmlConf) {
        testParse_xmlconf();
    }
    var testSuite = getFirstChildElement(xmlConf, "TESTSUITE");
    var i = 0;
    var testcase;
    for (testcase = getFirstChildElement(testSuite, "TESTCASES"); testcase && i < testCaseId ; testcase = getNextSiblingElement(testcase, "TESTCASES")) {
        i++;
    }
    //there must be content of xmlconf\xmltest\xmltest.xml inside
    return testcase.getElementsByTagName("TEST");
}

function removeFileName(path) {
    var idx = path.lastIndexOf('/');
    return path.substring(0, idx + 1);
}

function getBaseUri(node, uri) {
    //remove eventual file name at the end of the path
    var baseUri = removeFileName(node.custBaseURI);
    return baseUri + uri;
}

function testParse_valid(testCaseId) {
    var tests = prepareTestParse(testCaseId);
    for (var i = 0 ; i < tests.length ; i++) {
        var test = tests.item(i);
        var type = test.getAttribute("TYPE");
        if (type === "valid") {
            testCt++;
            var uri = test.getAttribute("URI");
            var parentUri = removeFileName(test.custBaseURI);
            var uriBased = parentUri + uri;
            var outputAttr = test.getAttribute("OUTPUT");
            var validOutput;
            if (outputAttr) {
                validOutput = parentUri + outputAttr;
            }
            var testLabel = textContent(test);
            try {
                parseTestCase_valid(uriBased, validOutput);
                output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>valid<\/td><\/tr>";
            } catch(e) {
                var conformance = isAssumedNotConformant(uri);
                if (conformance) {
                    notSupportedCt++;
                    output.innerHTML += "<tr style=\"background-color: orange\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + conformance + "<\/td><\/tr>";
                } else {
                    failedCt++;
                    output.innerHTML += "<tr style=\"background-color: red\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>FAILED, exception found :" + e.message + "<\/td><\/tr>";
                }
            }
        }
    }
}
    
function testParse_invalid(testCaseId) {
    var tests = prepareTestParse(testCaseId);    
    for (var i = 0 ; i < tests.length ; i++) {
        var test = tests.item(i);
        var type = test.getAttribute("TYPE");
        if (type === "invalid") {
            testCt++;
            var uri = test.getAttribute("URI");
            var uriBased = getBaseUri(test, uri);
            var testLabel = textContent(test);
            try {
                parseTestCase_invalid(uriBased);
                //should have been exceptions
                assertTrue("invalid XML not detected in uri : " + uri + ", expected message was : " + testLabel, false);
            } catch(e) {
                //e may be the jsunit exception, in that case test is failed
                if (e instanceof SAXParseException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + " at line " + e.getLineNumber() + " at column " + e.getColumnNumber() + "<\/td><\/tr>";
                } else if (e instanceof SAXException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + "<\/td><\/tr>";
                } else {
                    var conformance = isAssumedNotConformant(uri);
                    if (conformance) {
                        notSupportedCt++;
                        output.innerHTML += "<tr style=\"background-color: orange\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + conformance + "<\/td><\/tr>";
                    } else {
                        failedCt++;
                        output.innerHTML += "<tr style=\"background-color: red\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>FAILED<\/td><\/tr>";
                    }
                }
            }
        }
    }
}



function testParse_not_wf(testCaseId) {
    var tests = prepareTestParse(testCaseId);
    for (var i = 0 ; i < tests.length ; i++) {
        var test = tests.item(i);
        var type = test.getAttribute("TYPE");
        if (type === "not-wf") {
            testCt++;
            var uri = test.getAttribute("URI");
            var uriBased = getBaseUri(test, uri);
            var testLabel = textContent(test);
            try {
                parseTestCase(uriBased, testForStrictCharacterData(uri));
                //should have been exceptions
                assertTrue("not-wf XML not detected in uri : " + uri + ", test label was : " + testLabel, false);
            } catch(e) {
                //e may be the jsunit exception, in that case test is failed
                if (e instanceof SAXParseException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + " at line " + e.getLineNumber() + " at column " + e.getColumnNumber() + "<\/td><\/tr>";
                } else if (e instanceof SAXException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + "<\/td><\/tr>";
                } else {
                    var conformance = isAssumedNotConformant(uri);
                    if (conformance) {
                        notSupportedCt++;
                        output.innerHTML += "<tr style=\"background-color: orange\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + conformance + "<\/td><\/tr>";
                    } else {
                        failedCt++;
                        output.innerHTML += "<tr style=\"background-color: red\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>FAILED<\/td><\/tr>";
                    }
                }
            }
        }
    }
}

function testParse_error(testCaseId) {
    var tests = prepareTestParse(testCaseId);
    for (var i = 0 ; i < tests.length ; i++) {
        var test = tests.item(i);
        var type = test.getAttribute("TYPE");
        if (type === "error") {
            testCt++;
            var uri = test.getAttribute("URI");
            var uriBased = getBaseUri(test, uri);
            var testLabel = textContent(test);
            try {
                parseTestCaseError(uriBased, testForStrictCharacterData(uri));
                //should have been exceptions
                assertTrue("error in XML not detected in uri : " + uri + ", test label was : " + testLabel, false);
            } catch(e) {
                //e may be the jsunit exception, in that case test is failed
                if (e instanceof SAXParseException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + " at line " + e.getLineNumber() + " at column " + e.getColumnNumber() + "<\/td><\/tr>";
                } else if (e instanceof SAXException) {
                    output.innerHTML += "<tr><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + e.message + "<\/td><\/tr>";
                } else {
                    var conformance = isAssumedNotConformant(uri);
                    if (conformance) {
                        notSupportedCt++;
                        output.innerHTML += "<tr style=\"background-color: orange\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>" + conformance + "<\/td><\/tr>";
                    } else {
                        failedCt++;
                        output.innerHTML += "<tr style=\"background-color: red\"><td>" + uri + "<\/td><td>" + testLabel + "<\/td><td>FAILED<\/td><\/tr>";
                    }
                }
            }
        }
    }
}

function testParse(testCaseId) {
    testParse_xmlconf();
    testParse_valid(testCaseId);
    testParse_invalid(testCaseId);
    testParse_not_wf(testCaseId);
    testParse_error(testCaseId);
}

