/*global ActiveXObject, XSLTProcessor, window, xsltProcessor, createDocumentFromText, innerXML, XMLHttpRequest, alert, document, navigator */

function loadXMLDoc(fname) {
    var xmlDoc;
	//code for safari
	if (/Safari/.test(navigator.userAgent)) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.overrideMimeType('text/xml');
		xmlhttp.open('GET', fname, false);
		xmlhttp.send(null);
		if (xmlhttp.readyState === 4) {
			xmlDoc = xmlhttp.responseXML;
		}
	} else {
	    // code for IE
	    if (window.ActiveXObject) {
	        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	    }
	    // code for Mozilla, Firefox, Opera, etc.
	    else if (document.implementation && document.implementation.createDocument) {
	        xmlDoc = document.implementation.createDocument(null, "", null);
	    } else {
	        alert('Your browser cannot handle this script');
	    }
	    xmlDoc.async = false;
	    xmlDoc.load(fname);
	}
    return xmlDoc;
}

function loadFile(fname) {
	var xmlhttp = null;
	if (window.XMLHttpRequest) {// code for Firefox, Opera, IE7, etc.
		xmlhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp !== null) {
		xmlhttp.open("GET", fname, false);
		xmlhttp.send(null);
		if (xmlhttp.readyState === 4) {
			return xmlhttp.responseText;
		}
	} else {
		alert("Your browser does not support XMLHTTP.");
	}
    return false;
}

function applyXslt(xml, xsl, asFragment, paramMap) {
    var i;
    // code for IE 
    if (window.ActiveXObject) {
        var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0" );
		var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0" );
		xslDoc.async = false;
		xslDoc.load(xsl);
		xslt.stylesheet = xslDoc;
		var xslProc = xslt.createProcessor();
		xslProc.input = xml;
		if (paramMap) {
			for (i in paramMap) {
				xslProc.addParameter(i, paramMap[i]);
			}
		}
		xslProc.transform();
		return xslProc.output;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument) {
		xsl = loadXMLDoc(xsl);
        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
		if (paramMap) {
			for (i in paramMap) {
				xsltProcessor.setParameter(null, i, paramMap[i]);
			}
		}
		var resultDocument;
		if (asFragment) {
			resultDocument = xsltProcessor.transformToFragment(xml, document);
		} else {
			resultDocument = xsltProcessor.transformToDocument(xml, document);
		}
        return resultDocument;
    }
    else {
        throw 'Your browser apparently does not support XSLT';
    }
}

function applyXsltOnText(xml, xsl) {
    xml = createDocumentFromText(xml);
	var result = applyXslt(xml, xsl);
    return innerXML(result);
}