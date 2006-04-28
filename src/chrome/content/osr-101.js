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
 * This module contains the code to communicate with a CMS
 * supporting the OSR-101 specification (see
 * http://www.wyona.org/osr-101/osr-101.xhtml).
 */

// A new namespace. EXPERIMENTAL!
OSR101 = {
    /**
     * Fetch introspection file.
     *
     * @param  {String}       aURI URI of CMS to query for introspection file
     * @return {Capabilities} a Capabilities object
     */
    introspection: function (aURI) {
        // ...
    },

    /**
     * Save an asset at the indicated path on the server.
     *
     * @param  {Asset}     aAsset the asset to save
     * @param  {String}    aPath  the location on the CMS where the asset should be saved
     * @return {Undefined}
     * @throws {Error}     OSR101TransactionException
     */
    save: function (aAsset, aPath) {
        // ...
    },

    /**
     * Asset constructor. Instantiates a new object of type Asset.
     *
     * @constructor
     * @param  {String} aContent   an URI to the file where the content resides
     * @param  {String} aAssetType the asset type of the asset
     * @return {Asset}  a new Asset object
     */
    Asset: function (aContent, aAssetType) {
        // private instance attributes
        content   = aContent;
        assetType = aAssetType;

        // privileged instance methods
        /**
         * Return the content URI.
         *
         * @return {String} the content URI
         */
        this.getContent() {
            return content;
        }

        /**
         * Return the asset type.
         *
         * @return {String} the asset type
         */
        this.getAssetType() {
            return assetType;
        }
    },

    /**
     * Capabilities constructor. Instantiates a new object of type Capabilities.
     *
     * @constructor
     * @return {Capabilities} a new Capabilities object
     */
    Capabilities: function () {
        // ...
    }

    Capabilities.prototype: {
        // THE SPECIFICATION MUST FIRST BE WRITTEN FOR THIS PART
        compatibility: function () {
            // return compatibility level
        },

        queryFoo: function () {
            // return capability status of operation Foo
        },

        queryBar: function () {
            // return capability status of operation Bar
        }
    }
}
