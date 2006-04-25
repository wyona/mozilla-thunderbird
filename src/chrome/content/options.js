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
 * This module contains code used in the preferences dialog.
 */

const OPTIONS_ADDCMS = "chrome://cmsconnector/content/options-addcms.xul"

var Options = {
    addCMS: function () {
        if (!document.documentElement.openSubDialog(OPTIONS_ADDCMS, "", null))
            throw new CMSConnectorExecutionException("CMSConnector:options.js:Options.addCMS(): Unable to open window \"" + OPTIONS_ADDCMS + "\"");
    },

    removeCMS: function () {
        return true;
    },

    saySomething: function () {
        alert("Hello there!");
    }
}
