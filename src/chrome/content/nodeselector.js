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
 * This module contains the code used to select a node on the CMS.
 */

const NODESELECTORXUL = "chrome://cmsconnector/content/nodeselector.xul"

var sCMSURI       = null;
var sSelectedNode = null;
var sReturnStatus = null;

function NodeSelector() {
}

NodeSelector = {
    // public static methods
    /**
     * Selects a Node on the CMS.
     *
     * @param  {String}    aCMSURI                        the URI of the target CMS
     * @return {Undefined}
     * @throws {Error}     CMSConnectorAbortException
     * @throws {Error}     CMSConnectorExecutionException
     */
    selectNode : function (aCMSURI) {
        /* DEBUG */ dump("CMSConnector:nodeselector.js:selectNode() invoked\n");
        NodeSelector.sCMSURI = aCMSURI;
        return NodeSelector.nodeSelectorDialog();
    },

    nodeSelectorDialog : function () {
        /* Open nodeselector.xul window. Note that the mode is
         * modal, which means that the openDialog() call blocks.
         * The results of the interactions with the dialog have
         * to be stored in static variables via the various
         * callback functions. */
        if (!window.openDialog(NODESELECTORXUL, 'ui-nodeselector', 'modal'))
            throw new CMSConnectorExecutionException("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): Unable to open window " + NODESELECTORXUL);

        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): back from the dialog.\n");

        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): sReturnStatus: \"" + sReturnStatus + "\"\n");

        if (!sReturnStatus)
            throw new CMSConnectorAbortException("CMSConnector:nodeselector.js:NodeSelector.nodeSelectorDialog(): Selection aborted");

        return sSelectedNode;
    },

    onDialogCancel : function () {
        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogCancel() invoked\n");
        sReturnStatus = false;
        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogCancel(): return status set.\n");
        return true;
    },

    onDialogAccept : function () {
        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogAccept() invoked\n");
        self.sReturnStatus = true;
        /* DEBUG */ dump("CMSConnector:nodeselector.js:NodeSelector.onDialogAccept(): return status set.\n");
        return true;
    },

    nodeSelectorLoad : function (aEvent) {
        var cmsName            = null;
        var nodeSelectorDialog = null;

        // query the CMS server (introspection)

        // get CMS name
        cmsName = "";

        // set window title
        nodeSelectorDialog = document.getElementById('ui-nodeselector');
        nodeSelectorDialog.setAttribute('title', nodeSelectorDialog.getAttribute('title') + cmsName);
    }
}
