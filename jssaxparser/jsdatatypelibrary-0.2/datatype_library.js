/*global Empty, NotAllowed*/
/*

Copyright or © or Copr. Nicolas Debeissat

nicolas.debeissat@gmail.com (http://debeissat.nicolas.free.fr/)

This software is a computer program whose purpose is to validate XML
against a RelaxNG schema.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 

As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 

In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.

*/

/*
implementation of datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"

extract from http://www.w3schools.com/Schema/schema_dtypes_string.asp :

ENTITIES  															KO
ENTITY 	 															KO
ID 	A string that represents the ID attribute in XML (only used with schema attributes)			KO
IDREF 	A string that represents the IDREF attribute in XML (only used with schema attributes)		KO
IDREFS 	 															KO
language 	A string that contains a valid language id									OK
Name 	A string that contains a valid XML name									OK
NCName																OK
NMTOKEN 	A string that represents the NMTOKEN attribute in XML (only used with schema attributes)	KO
NMTOKENS 	 														KO
normalizedString 	A string that does not contain line feeds, carriage returns, or tabs				OK
QName 	 															OK
string 	A string														OK
token 	A string that does not contain line feeds, carriage returns, tabs, leading or trailing spaces, or multiple spaces OK

extract from http://www.w3schools.com/Schema/schema_dtypes_date.asp :

date  	Defines a date value													OK
dateTime 	Defines a date and time value											OK
duration 	Defines a time interval												OK
gDay 	Defines a part of a date - the day (DD)										OK
gMonth 	Defines a part of a date - the month (MM)									OK
gMonthDay 	Defines a part of a date - the month and day (MM-DD)							OK
gYear 	Defines a part of a date - the year (YYYY)									OK
gYearMonth 	Defines a part of a date - the year and month (YYYY-MM)					OK
time 	Defines a time value													OK

extract from http://www.w3schools.com/Schema/schema_dtypes_numeric.asp :

byte  	A signed 8-bit integer													OK
decimal 	A decimal value													OK
int 	A signed 32-bit integer													OK
integer 	An integer value													OK
long 	A signed 64-bit integer													OK
negativeInteger 	An integer containing only negative values ( .., -2, -1.)						OK
nonNegativeInteger 	An integer containing only non-negative values (0, 1, 2, ..)				OK
nonPositiveInteger 	An integer containing only non-positive values (.., -2, -1, 0)				OK
positiveInteger 	An integer containing only positive values (1, 2, ..)						OK
short 	A signed 16-bit integer													OK
unsignedLong 	An unsigned 64-bit integer										OK
unsignedInt 	An unsigned 32-bit integer										OK
unsignedShort 	An unsigned 16-bit integer										OK
unsignedByte 	An unsigned 8-bit integer										OK

extract from http://www.w3schools.com/Schema/schema_dtypes_misc.asp :

anyURI  	 															does not do any validation
base64Binary 	 														OK
boolean 	 															OK
double 	 															OK
float 	                                                                                                                                                                            same as double
hexBinary 	 															OK
NOTATION 	                                                                                                                                                     same as QName 
QName 	                                                                                                                                                                OK

extract from http://www.w3schools.com/Schema/schema_elements_ref.asp :

enumeration  	Defines a list of acceptable values
fractionDigits 	Specifies the maximum number of decimal places allowed. Must be equal to or greater than zero                OK
length 	Specifies the exact number of characters or list items allowed. Must be equal to or greater than zero                  OK but not for list and only length of string
maxExclusive 	Specifies the upper bounds for numeric values (the value must be less than this value)                                  OK
maxInclusive 	Specifies the upper bounds for numeric values (the value must be less than or equal to this value)              OK
maxLength 	Specifies the maximum number of characters or list items allowed. Must be equal to or greater than zero             OK
minExclusive 	Specifies the lower bounds for numeric values (the value must be greater than this value)                            OK
minInclusive 	Specifies the lower bounds for numeric values (the value must be greater than or equal to this value)           OK
minLength 	Specifies the minimum number of characters or list items allowed. Must be equal to or greater than zero                 OK
pattern 	Defines the exact sequence of characters that are acceptable                                                                                    OK
totalDigits 	Specifies the exact number of digits allowed. Must be greater than zero                                                                   OK
whiteSpace 	Specifies how white space (line feeds, tabs, spaces, and carriage returns) is handled                                   KO

*/
(function () { // Begin namespace


function DatatypeLibrary() {

    this.languageRegExp = new RegExp("^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$");
    this.nameStartChar = "A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u0200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\ud800-\udb7f\udc00-\udfff";
    this.nameChar = this.nameStartChar + "\\-\\.0-9\u00B7\u0300-\u036F\u203F-\u2040-";
    this.nameRegExp = new RegExp("^[:" + this.nameStartChar + "][:" + this.nameChar + "]*$");
    this.ncNameRegExp = new RegExp("^[" + this.nameStartChar + "][" + this.nameChar + "]*$");

    this.whitespaceChar = "\t\n\r";
    this.normalizedStringRegExp = new RegExp("^[^" + this.whitespaceChar + "]*$");
    
    this.qNameRegExp = new RegExp("^[" + this.nameStartChar + "][" + this.nameChar + "]*(:[" + this.nameStartChar + "]+)?$");
    
    this.tokenRegExp = new RegExp("^([^" + this.whitespaceChar + " ](?!.*  )([^" + this.whitespaceChar + "]*[^" + this.whitespaceChar + " ])?)?$");
    
    this.year = "-?([1-9][0-9]*)?[0-9]{4}";
    this.month = "[0-9]{2}";
    this.dayOfMonth = "[0-9]{2}";
    this.time = "[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]*)?";
    this.timeZone = "(Z|[\\-\\+][0-9][0-9]:[0-5][0-9])?";
    
    this.dateRegExp = new RegExp("^" + this.year + "-" + this.month + "-" + this.dayOfMonth + this.timeZone + "$");
    
    this.dateTimeRegExp = new RegExp("^" + this.year + "-" + this.month + "-" + this.dayOfMonth + "T" + this.time + this.timeZone + "$");
    
    this.durationRegExp = new RegExp("^" + "-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$");
    
    this.gDayRegExp = new RegExp("^" + "---" + this.dayOfMonth + this.timeZone + "$");
    
    this.gMonthRegExp = new RegExp("^" + "--" + this.month + this.timeZone + "$");
    
    this.gMonthDayRegExp = new RegExp("^" + "--" + this.month + "-" + this.dayOfMonth + this.timeZone + "$");
    
    this.gYearRegExp = new RegExp("^" + this.year + this.timeZone + "$");
    
    this.gYearMonthRegExp = new RegExp("^" + this.year + "-" + this.month + this.timeZone + "$");
    
    this.timeRegExp = new RegExp("^" + this.time + this.timeZone + "$");
    
    this.LONG_MAX = 9223372036854775807;
    this.LONG_MIN = -9223372036854775808;
    this.INT_MAX = 2147483647;
    this.INT_MIN = -2147483648;
    this.SHORT_MAX = 32767;
    this.SHORT_MIN = -32768;
    this.BYTE_MAX = 127;
    this.BYTE_MIN = -128;

    this.UNSIGNED_LONG_MAX = 18446744073709551615;
    this.UNSIGNED_INT_MAX = 4294967295;
    this.UNSIGNED_SHORT_MAX = 65535;
    this.UNSIGNED_BYTE_MAX = 255;
    
    this.integer = "[\\-\\+]?[0-9]+";
    
    this.integerRegExp = new RegExp("^" + this.integer + "$");
    
    this.decimal = "[\\-\\+]?(?!$)[0-9]*(\\.[0-9]*)?";
    
    this.decimalRegExp = new RegExp("^" + this.decimal + "$");
    
    /*
    Base64Binary  ::=  ((B64S B64S B64S B64S)*
                     ((B64S B64S B64S B64) |
                      (B64S B64S B16S '=') |
                      (B64S B04S '=' #x20? '=')))?

B64S         ::= B64 #x20?

B16S         ::= B16 #x20?

B04S         ::= B04 #x20?

B04         ::=  [AQgw]
B16         ::=  [AEIMQUYcgkosw048]
B64         ::=  [A-Za-z0-9+/] 
*/
    this.b64 = "[A-Za-z0-9+/]";
    this.b16 = "[AEIMQUYcgkosw048]";
    this.b04 = "[AQgw]";
    this.b04S = "(" + this.b04 + " ?)";
    this.b16S = "(" + this.b16 + " ?)";
    this.b64S = "(" + this.b64 + " ?)";
    
    this.base64BinaryRegExp = new RegExp("^((" + this.b64S + "{4})*((" + this.b64S + "{3}" + this.b64 + ")|(" + this.b64S + "{2}" + this.b16S + "=)|(" + this.b64S + this.b04S + "= ?=)))?$");
    
    this.booleanRegExp = new RegExp("(^true$)|(^false$)|(^0$)|(^1$)", "i");
    
    this.doubleRegExp = new RegExp("(^-?INF$)|(^NaN$)|(^" + this.decimal + "([Ee]" + this.integer + ")?$)");
    
    this.hexBinaryRegExp = new RegExp("^" + "[0-9a-fA-F]*" + "$");
    
    this.fractionDigits = "\\.[0-9]";
    
    this.PRESERVE = "preserve";
    this.REPLACE = "replace";
    this.COLLAPSE = "collapse";
}

    /*
    datatypeAllows :: Datatype -> ParamList -> String -> Context -> Bool
    datatypeAllows ("",  "string") [] _ _ = True
    datatypeAllows ("",  "token") [] _ _ = True
    */
DatatypeLibrary.prototype.datatypeAllows = function(datatype, paramList, string, context) {
    var value;
    if (datatype.uri === "http://www.w3.org/2001/XMLSchema-datatypes") {
        /*
        
        Date and duration checks
        
        */
        switch (datatype.localName) {
            case "date":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.dateRegExp, value, datatype, paramList);                
            case "dateTime":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.dateTimeRegExp, value, datatype, paramList);
            case "gDay":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.gDayRegExp, value, datatype, paramList);
            case "gMonth":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.gMonthRegExp, value, datatype, paramList);
            case "gMonthDay":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.gMonthDayRegExp, value, datatype, paramList);
            case "gYear":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.gYearRegExp, value, datatype, paramList);
            case "gYearMonth":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.gYearMonthRegExp, value, datatype, paramList);
            case "time":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.timeRegExp, value, datatype, paramList);
            case "duration":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.durationRegExp, value, datatype, paramList);
        /*
        
        primitive types
    
        */
            case "boolean":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.booleanRegExp, value, datatype, paramList);
            case "base64Binary":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.base64BinaryRegExp, value, datatype, paramList);
            case "hexBinary":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.hexBinaryRegExp, value, datatype, paramList);
            case "float":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.doubleRegExp, value, datatype, paramList);
            case "double":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.doubleRegExp, value, datatype, paramList);
            case "anyURI":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkParams(value, datatype, paramList);
            case "QName":
            case "NOTATION":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                var result = this.checkRegExpAndParams(this.qNameRegExp, value, datatype, paramList);
                if (result instanceof NotAllowed) {
                    return result;
                }
                return this.checkPrefixDeclared(value, context, datatype);
        /*
        
        types derived from string
        
        */
            case "string":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkParams(value, datatype, paramList);
            case "normalizedString":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkRegExpAndParams(this.normalizedStringRegExp, value, datatype, paramList);
            case "token":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkRegExpAndParams(this.tokenRegExp, value, datatype, paramList);
            case "language":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkRegExpAndParams(this.languageRegExp, value, datatype, paramList);
            case "Name":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkRegExpAndParams(this.nameRegExp, value, datatype, paramList);
            case "NCName":
                value = this.whitespace(string, this.PRESERVE, paramList);
                return this.checkRegExpAndParams(this.ncNameRegExp, value, datatype, paramList);
        /*
        
        types derived from decimal
        
        */
            case "decimal":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.decimalRegExp, value, datatype, paramList);
            case "integer":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkRegExpAndParams(this.integerRegExp, value, datatype, paramList);
            case "long":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(this.LONG_MIN, this.LONG_MAX, value, datatype, paramList);
            case "int":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(this.INT_MIN, this.INT_MAX, value, datatype, paramList);
            case "short":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(this.SHORT_MIN, this.SHORT_MAX, value, datatype, paramList);
            case "byte":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(this.BYTE_MIN, this.BYTE_MAX, value, datatype, paramList);
        /*
        
        integer types
        
        */
            case "negativeInteger":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(undefined, -1, value, datatype, paramList);
            case "nonPositiveInteger":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(undefined, 0, value, datatype, paramList);
            case "nonNegativeInteger":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(0, undefined, value, datatype, paramList);
            case "positiveInteger":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(1, undefined, value, datatype, paramList);
        /*
        
        signed or unsigned numbers
        
        */
            case "unsignedLong":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(0, this.UNSIGNED_LONG_MAX, value, datatype, paramList);
            case "unsignedInt":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(0, this.UNSIGNED_INT_MAX, value, datatype, paramList);
            case "unsignedShort":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(0, this.UNSIGNED_SHORT_MAX, value, datatype, paramList);
            case "unsignedByte":
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkIntegerRange(0, this.UNSIGNED_BYTE_MAX, value, datatype, paramList);
            default:
                value = this.whitespace(string, this.COLLAPSE, paramList);
                return this.checkParams(value, datatype, paramList);
        }
    } else {
        value = this.whitespace(string, this.COLLAPSE, paramList);
        return this.checkParams(value, datatype, paramList);
    }
};

/*
    datatypeEqual :: Datatype -> String -> Context -> String -> Context -> Bool
    datatypeEqual ("",  "string") s1 _ s2 _ = (s1 == s2)
    datatypeEqual ("",  "token") s1 _ s2 _ = (normalizeWhitespace s1) == (normalizeWhitespace s2)
    */
DatatypeLibrary.prototype.datatypeEqual = function(datatype, patternString, patternContext, string, context) {
    var value, patternValue;
    if (datatype.uri === "http://www.w3.org/2001/XMLSchema-datatypes") {
        switch (datatype.localName) {
            case "boolean":
                value = this.whitespace(string, this.COLLAPSE);
                patternValue = this.whitespace(patternString, this.COLLAPSE);
                if (value.toLowerCase() === patternValue.toLowerCase()) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            case "float":
            case "double":
            case "decimal":
                value = parseFloat(string);
                patternValue = parseFloat(patternString);
                if (value === patternValue) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            case "integer":
            case "long":
            case "int":
            case "short":
            case "byte":
            case "negativeInteger":
            case "nonPositiveInteger":
            case "nonNegativeInteger":
            case "positiveInteger":
            case "unsignedLong":
            case "unsignedInt":
            case "unsignedShort":
            case "unsignedByte":
                value = parseInt(string, 10);
                patternValue = parseInt(patternString, 10);
                if (value === patternValue) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            case "anyURI":
            case "QName":
            case "NOTATION":
                value = this.whitespace(string, this.COLLAPSE);
                patternValue = this.whitespace(patternString, this.COLLAPSE);
                if (value === patternValue) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
                
            case "string":
            case "normalizedString":
            case "token":
            case "language":
            case "Name":
            case "NCName":
                value = this.whitespace(string, this.PRESERVE);
                patternValue = this.whitespace(patternString, this.PRESERVE);
                if (value === patternValue) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            case "base64Binary":
                value = string.replace(/ /g, "");
                patternValue = patternString.replace(/ /g, "");
                if (value === patternValue) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            case "hexBinary":
                value = this.whitespace(string, this.COLLAPSE);
                patternValue = this.whitespace(patternString, this.COLLAPSE);
                //canonical representation of hexBinary prohibites lower case
                if (value.toUpperCase() === patternValue.toUpperCase()) {
                    return new Empty();
                }
                return new NotAllowed("invalid value, expected is " + patternValue, datatype, string, 10);
            default:
                return new Empty();
        }
    } else {
        return new Empty();
    }
};

DatatypeLibrary.prototype.whitespace = function(string, wsDefault, paramList) {
    var wsParam = wsDefault;
    if (paramList) {
        var i = paramList.length;
        while (i--) {
            var param = paramList[i];
            if (param.localName === "whiteSpace") {
                wsParam = param.string;
            }
        }
    }
    if (wsParam === this.PRESERVE) {
        return string.replace(/[\t\n\r]/g, " ");
    } else if (wsParam === this.COLLAPSE) {
        var value = string.replace(/[\t\n\r ]+/g, " ");
        //removes leading and trailing space
        return value.replace(/^ /, "").replace(/ $/, "");
    }
    return string;
};

DatatypeLibrary.prototype.checkIntegerRange = function(min, max, string, datatype, paramList) {
    var checkInteger = this.checkRegExp(this.integerRegExp, string, datatype);
    if (checkInteger instanceof NotAllowed) {
        return checkInteger;
    }
    var intValue = parseInt(string, 10);
    //min can be undefined if condition is just inferior
    if (min !== undefined) {
        if (intValue < min) {
            return new NotAllowed("integer value is too small, minimum is " + min + " for datatype " + datatype.localName, datatype, string, 10);
        }
    }
    if (max !== undefined) {
        if (intValue > max) {
            return new NotAllowed("integer value is too big, maximum is " + max + " for datatype " + datatype.localName, datatype, string, 10);
        }
    }
    return this.checkParams(string, datatype, paramList);
};

DatatypeLibrary.prototype.checkRegExpAndParams = function(regExp, string, datatype, paramList) {
    var check = this.checkRegExp(regExp, string, datatype);
    if (check instanceof NotAllowed) {
        return check;
    }
    return this.checkParams(string, datatype, paramList);
};

DatatypeLibrary.prototype.checkRegExp = function(regExp, string, datatype) {
    if (regExp.test(string)) {
        return new Empty();
    }
    return new NotAllowed("invalid " + datatype.localName, datatype, string, 10);
};

/*
        negation of checkRegExp
        */
DatatypeLibrary.prototype.checkExclusiveRegExp = function(regExp, string, datatype) {
    if (regExp.test(string)) {
        return new NotAllowed("invalid " + datatype.localName, datatype, string, 10);
    }
    return new Empty();
};

DatatypeLibrary.prototype.checkPrefixDeclared = function(string, context, datatype) {
    if (string.match(":")) {
        var prefix = string.split(":")[0];
        if (context.map[prefix] === undefined) {
            return new NotAllowed("prefix " + prefix + " not declared", datatype, string, 10);
        }
    }
    return new Empty();
};

DatatypeLibrary.prototype.checkParams = function(string, datatype, paramList) {
    var check;
    var enumeration = [];
    for (var i = 0 ; i < paramList.length ; i++) {
        var param = paramList[i];
        //gathers enumerations before triggering it
        if (param.localName === "enumeration") {
            enumeration.push(param.string);
        } else if (param.localName != "whiteSpace") {
            check = this.checkParam(string, param, datatype);
            if (check instanceof NotAllowed) {
                return check;
            }
        }
    }
    if (enumeration.length > 0) {
        check = this.checkEnumeration(string, enumeration, datatype);
        if (check instanceof NotAllowed) {
            return check;
        }
    }
    return new Empty();
};

DatatypeLibrary.prototype.checkParam = function(string, param, datatype) {
    var number, value, check, regExp;
    if (param.localName === "length") {
        number = parseInt(param.string, 10);
        if (string.length != number) {
            return new NotAllowed("invalid number of characters, expected : " + number + ", found : " + string.length, datatype, string, 10);
        }
    } else if (param.localName === "minLength") {
        number = parseInt(param.string, 10);
        if (string.length < number) {
            return new NotAllowed("string too small, " + param.localName + " is : " + number + ", found : " + string.length, datatype, string, 10);
        }
    } else if (param.localName === "maxLength") {
        number = parseInt(param.string, 10);
        if (string.length > number) {
            return new NotAllowed("string too long, " + param.localName + " is : " + number + ", found : " + string.length, datatype, string, 10);
        }
    } else if (param.localName === "minInclusive") {
        number = parseFloat(param.string);
        value = parseFloat(string);
        if (value < number) {
            return new NotAllowed("value too small, " + param.localName + " is : " + number + ", found : " + value, datatype, string, 10);
        }
    } else if (param.localName === "minExclusive") {
        number = parseFloat(param.string);
        value = parseFloat(string);
        if (value <= number) {
            return new NotAllowed("value too small, " + param.localName + " is : " + number + ", found : " + value, datatype, string, 10);
        }
    } else if (param.localName === "maxInclusive") {
        number = parseFloat(param.string);
        value = parseFloat(string);
        if (value > number) {
            return new NotAllowed("value too big, " + param.localName + " is : " + number + ", found : " + value, datatype, string, 10);
        }
    } else if (param.localName === "maxExclusive") {
        number = parseFloat(param.string);
        value = parseFloat(string);
        if (value >= number) {
            return new NotAllowed("value too big, " + param.localName + " is : " + number + ", found : " + value, datatype, string, 10);
        }
    } else if (param.localName === "totalDigits") {
        number = parseInt(param.string, 10);
        var length = string.replace(/\./, "").length;
        if (length != number) {
            return new NotAllowed("invalid number of digits, " + param.localName + " is : " + number + ", found : " + length, datatype, string, 10);
        }
    } else if (param.localName === "fractionDigits") {
        number = parseInt(param.string, 10);
        regExp = new RegExp(this.fractionDigits + "{" + number + "}$");
        check = this.checkRegExp(regExp, string, datatype);
        //adds an error message
        if (check instanceof NotAllowed) {
            return new NotAllowed("invalid number of fraction digits, expected : " + number, check, string, 10);
        }
    } else if (param.localName === "pattern") {
        var escaped = param.string.replace(/\\/gm, "\\\\");
        regExp = new RegExp("^" + escaped + "$");
        check = this.checkRegExp(regExp, string, datatype);
        //adds an error message
        if (check instanceof NotAllowed) {
            return new NotAllowed("value : " + string + " does not respect pattern : " + param.string, check, string, 10);
        }
    }
    return new Empty();
};

DatatypeLibrary.prototype.checkEnumeration = function(string, enumeration, datatype) {
    var value;
    var i = enumeration.length;
    while (i--) {
        value = enumeration[i];
        var escaped = this.escapeRegExp(value);
        var regExp = new RegExp("^" + escaped + "$");
        var check = this.checkRegExp(regExp, string, datatype);
        if (check instanceof Empty) {
            return check;
        }
    }
    var msg = "invalid value : " + string + ", must be one of : [" + enumeration[0];
    for (i = 1 ; i < enumeration.length ; i++) {
        value = enumeration[i];
        msg += "," + value;
    }
    msg += "]";
    return new NotAllowed(msg, datatype, string, 10);
};

DatatypeLibrary.prototype.escapeRegExp = function (str) {
    return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r\[\^$|?*+(){}])/gm, "\\$1");
};
    
this.DatatypeLibrary = DatatypeLibrary;

}()); // end namespace
