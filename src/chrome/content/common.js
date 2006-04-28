/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright 2006 Wyona AG Zurich
 *
 * This file is part of CMSConnector.
 *
 * CMSConnector is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * CMSConnector is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with CMSConnector; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
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
    // /* DEBUG */ dump("CMSConnector:common.js:CMSConnectorException(" + aMessage + ") invoked.\n");
    this.message = aMessage;
    this.name    = "CMSConnectorException";
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
    // /* DEBUG */ dump("CMSConnector:common.js:CMSConnectorExecutionException(" + aMessage + ") invoked.\n");
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
    // /* DEBUG */ dump("CMSConnector:common.js:CMSConnectorAbortException(" + aMessage + ") invoked.\n");
    // call super constructor
    this.__proto__.__proto__.constructor.call(this, aMessage);
    this.name = "CMSConnectorAbortException";
}

CMSConnectorAbortException.prototype.__proto__ = CMSConnectorException.prototype;
