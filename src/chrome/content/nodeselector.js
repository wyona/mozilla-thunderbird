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

/**
 * Selects a Node on the CMS.
 *
 * @return {Undefined}
 * @throws {Error}     CMSConnectorAbortException
 * @throws {Error}     CMSConnectorExecutionException
 */
function selectNode() {
    /* DEBUG */ dump("CMSConnector:nodeselector.js:selectNode() invoked\n");

    // open nodeselector.xul window, query for node, and return it
    if (!window.openDialog(NODESELECTORXUL, "ui-nodeselector", ""))
        throw new CMSConnectorExecutionException("Unable to open window " + NODESELECTORXUL);

    /* DEBUG */ dump("CMSConnector:nodeselector.js:selectNode(): window sucessfuly opened\n");

    /* DEBUG */ throw new CMSConnectorAbortException("Selection aborted");
}
