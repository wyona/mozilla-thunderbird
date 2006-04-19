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
