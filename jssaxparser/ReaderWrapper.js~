/*global window, ReaderWrapper */
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
function ReaderWrapper(reader) {
    this.reader = reader;
    this.peeked = [];
}

/************ NOT USED BY SCANNER ********************/

ReaderWrapper.WS = new RegExp('[\\t\\n\\r ]');

ReaderWrapper.prototype.peekLen = function (len) {
    var returned = "", lenRead, i, j;
    for (i = 0 ; i < this.peeked.length && i < len; i++) {
        returned += this.peeked[i];
    }
    lenRead = len - i;
    if (len > 0) {
       returned += this.reader.read(returned, 0, lenRead);
       for(j = i ; j < len ; j++) {
           this.peeked.push(returned.charAt(j));
       }
    }
    return returned;
}

ReaderWrapper.prototype.skip = function (n) {
    for (var i = 0 ; this.peeked.length !== 0 && i < n; i++) {
        this.peeked.shift();
    }
    n -= i;
    if (n) {
        this.reader.skip(n);
    }
};


/************ USED BY SCANNER ********************/

/*
consumes first char of peeked array, or consumes next char of Reader
*/
ReaderWrapper.prototype.next = function () {
    if (this.peeked.length !== 0) {
         return this.peeked.shift();
    }
    return this.reader.read();
};


/*
read next char without consuming it
if peeked buffer is not empty take the first one
else take next char of Reader and keep it in peeked
*/
ReaderWrapper.prototype.peek = function () {
    if (this.peeked.length !== 0) {
         return this.peeked[0];
    }
    var returned = this.reader.read();
    this.peeked.push(returned);
    return returned;
};

/*
if dontSkipWhiteSpace is not passed, then it is false so skipWhiteSpaces is default
if end of document, char is ''
*/
ReaderWrapper.prototype.nextChar = function(dontSkipWhiteSpace) {
    this.next();
    if (!dontSkipWhiteSpace) {
        this.skipWhiteSpaces();
    }
};

ReaderWrapper.prototype.skipWhiteSpaces = function() {
    while (this.peek().search(ReaderWrapper.WS) !== -1) {
        this.next();
    }
};

/*
ending char is the last matching the regexp
return consumed chars
*/
ReaderWrapper.prototype.nextCharRegExp = function(regExp, continuation) {
    var returned = "", currChar = this.peek();
    while (true) {
        if (currChar.search(regExp) !== -1) {
            if (continuation && currChar.search(continuation.pattern) !== -1) {
                var cb = continuation.cb.call(this);
                if (cb !== true) {
                    return cb;
                }
                returned += currChar;
                currChar = this.peek();
                continue;
            }
            return returned;
        } else {
            returned += currChar;
            //consumes actual char
            this.next();
            currChar = this.peek();
        }
    }
};

/*
same as above but with a char not a regexp and no continuation
best for performance
*/
ReaderWrapper.prototype.nextCharWhileNot = function(ch) {
    var returned = "", currChar = this.peek();
    while (currChar !== ch) {
        returned += currChar;
        this.next();
        currChar = this.peek();
    }
    return returned;
}

/*

*/
ReaderWrapper.prototype.matchRegExp = function(len, regExp, dontConsume) {
    var follow = this.peekLen(len);
    if (follow.search(regExp) === 0) {
        if (!dontConsume) {
            this.skip(len);
        }
        return true;
    }
    return false;
}

/*
*/
ReaderWrapper.prototype.matchStr = function(str) {
    var len = str.length;
    var follow = this.peekLen(len);
    if (follow === str) {
        this.skip(len);
        return true;
    }
    return false;
};

/*
if next char is ch
*/
ReaderWrapper.prototype.matchChar = function(ch) {
   if (this.equals(ch)) {
       this.next();
       return true;
   }
   return false;
}
/*
beginnnig before quote
ending after quote
*/
ReaderWrapper.prototype.quoteContent = function() {
    var quote = this.next();
    var content = this.nextCharWhileNot(quote);
    this.next();
    return content;
};

ReaderWrapper.prototype.equals = function(ch) {
      return ch === this.peek();
};

ReaderWrapper.prototype.unequals = function(ch) {
      return ch !== this.peek();
};

ReaderWrapper.prototype.unread = function (str) {
    for(var i = 0 ; i < str.length ; i++) {
        this.peeked.push(str.charAt(i));
    }
};

