/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright  2006 The Apache Software Foundation
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * ***** END LICENSE BLOCK *****
 */

/**
 * @author Andreas Wuest
 *
 * This module contains code common to all modules.
 */

const CMSCONNECTOR_REPORT_BUG = "Please report a defect on CMSConnector. Contact www.wyona.com and supply a description of the steps taken to trigger this message, as well as this message itself."

/**
 * Attachment constructor. Instantiates a new object of type Attachment.
 *
 * @constructor
 * @param  {String}     aName        the name of the attachment
 * @param  {String}     aContentType the mime type of the attachment
 * @param  {String}     aUri         the location of the attachment
 * @return {Attachment}
 */
function Attachment(aName, aContentType, aUri) {
    this.name        = aName;
    this.contentType = aContentType;
    this.uri         = aUri;
}

Attachment.prototype = {
    name       : null,
    contentType: null,
    uri        : null
}


/**
 * CMSConnectorException constructor. Instantiates a new object of
 * type CMSConnectorException.
 *
 * @constructor
 * @param  {String}                aMessage a descriptive error message
 * @return {CMSConnectorException}
 */
function CMSConnectorException(aMessage) {
    /* DEBUG */ dump("CMSConnector:common.js:__CMSConnectorException(" + aMessage + ") invoked.\n");
    this.message = aMessage;
    this.name    = "__CMSConnectorException";
}

CMSConnectorException.prototype.__proto__  = Error.prototype;


/**
 * CMSConnectorExecutionException constructor. Instantiates a new object of
 * type CMSConnectorExecutionException.
 *
 * @constructor
 * @param  {String}                         aMessage a descriptive error message
 * @return {CMSConnectorExecutionException}
 */
function CMSConnectorExecutionException(aMessage) {
    /* DEBUG */ dump("CMSConnector:common.js:CMSConnectorExecutionException(" + aMessage + ") invoked.\n");
    // call super constructor
    this.__proto__.__proto__.constructor.call(this, aMessage);
    this.name = "CMSConnectorExecutionException";
}

CMSConnectorExecutionException.prototype.__proto__ = CMSConnectorException.prototype;


/**
 * CMSConnectorAbortException constructor. Instantiates a new object of
 * type CMSConnectorAbortException.
 *
 * @constructor
 * @param  {String}                     aMessage a descriptive error message
 * @return {CMSConnectorAbortException}
 */
function CMSConnectorAbortException(aMessage) {
    /* DEBUG */ dump("CMSConnector:common.js:CMSConnectorAbortException(" + aMessage + ") invoked.\n");
    // call super constructor
    this.__proto__.__proto__.constructor.call(this, aMessage);
    this.name = "CMSConnectorAbortException";
}

CMSConnectorAbortException.prototype.__proto__ = CMSConnectorException.prototype;
