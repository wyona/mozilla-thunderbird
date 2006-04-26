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
    uiSavePaneOnPaneLoadHandler: function () {
        var uiCMSConnectorPrefsStringbundle = null;
        var uiCMSMenulist                   = null;

        /* DEBUG */ dump("CMSConnector:options.js:uiSavePaneOnPaneLoadHander() invoked\n");

        // load list of CMS from preferences

        // if list.length == 0, show default menulistitem
        uiCMSConnectorPrefsStringbundle = document.getElementById('uiCMSConnectorPrefsStringbundle');
        uiCMSMenulist                   = document.getElementById('uiCMSMenulist');

        // add default menulistitem
        uiCMSMenulist.appendItem(uiCMSConnectorPrefsStringbundle.getString('uiCMSPlaceholderMenuitem.label'), 'uiCMSPlaceholderMenuitem', null);

        // select it
        uiCMSMenulist.selectedIndex = 0;

        /* DEBUG */ dump("CMSConnector:options.js:uiSavePaneOnPaneLoadHander() left\n");
    },

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
