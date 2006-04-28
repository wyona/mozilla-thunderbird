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
 * This module contains the code used to select a node on the CMS.
 */

const NODESELECTORXUL = "chrome://cmsconnector/content/nodeselector.xul"

/**
 * NodeSelector constructor. Instantiates a new object of type NodeSelector.
 *
 * @constructor
 * @param  {String}       aCMSURI the URI of the target CMS
 * @return {NodeSelector}
 */
function NodeSelector(aCMSURI) {
    this.cmsURI       = aCMSURI;
    this.selectedNode = null;
    this.returnStatus = null;
}

/**
 * Selects a Node on the CMS.
 *
 * @param  {String}    aCMSURI                        the URI of the target CMS
 * @return {CMSNode}                                  the node selected by the user
 * @throws {Error}     CMSConnectorAbortException
 * @throws {Error}     CMSConnectorExecutionException
 */
NodeSelector.selectNode = function (aCMSURI) {
    /* DEBUG */ dump("CMSConnector:nodeselector.js:selectNode() invoked\n");

    /* NodeSelector instance is passed to the newly opened dialog
     * and acts as a container for in and out parameters. */
    var nodeSelector = new NodeSelector(aCMSURI);

    /* Open nodeselector.xul window. Note that the mode is
     * modal, which means that the openDialog() call blocks. */
    if (!window.openDialog(NODESELECTORXUL, 'ui-nodeselector', 'modal', nodeSelector))
        throw new CMSConnectorExecutionException("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): Unable to open window \"" + NODESELECTORXUL + "\"");

    if (!nodeSelector.returnStatus)
        throw new CMSConnectorAbortException("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): Node selection cancelled by user");

    return nodeSelector.selectedNode;
}

/**
 * Event handler for setting up the node selector.
 * <p>
 * Call after the dialog window has finished loading.
 *
 * @return {Undefined}
 */
NodeSelector.nodeSelectorLoad = function () {
    var cmsName            = null;
    var nodeSelectorDialog = null;

    // query the CMS server (introspection)

    // get CMS name
    cmsName = "";

    // set window title
    nodeSelectorDialog = document.getElementById('ui-nodeselector');
    nodeSelectorDialog.setAttribute('title', nodeSelectorDialog.getAttribute('title') + cmsName);
}

/**
 * Event handler for handling dialog cancel requests.
 *
 * @return {Boolean}
 */
NodeSelector.onDialogCancel = function () {
    /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogCancel() invoked\n");

    // set the returnStatus property of the passed in NodeSelector object
    window.arguments[0].returnStatus = false;

    // return true so that the dialog can get closed
    return true;
}

/**
 * Event handler for handling dialog accept requests.
 *
 * @return {Boolean}
 */
NodeSelector.onDialogAccept =function () {
    /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogAccept() invoked\n");

    // set the returnStatus property of the passed in NodeSelector object
    window.arguments[0].returnStatus = true;

    // return true so that the dialog can get closed
    return true;
}
