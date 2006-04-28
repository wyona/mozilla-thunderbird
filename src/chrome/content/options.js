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
