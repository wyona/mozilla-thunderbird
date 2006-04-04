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

/* Registers our init code to be run (see
 * http://developer.mozilla.org/en/docs/Extension_FAQ#Why_doesn.27t_my_script_run_properly.3F) */
window.addEventListener("load", initCMSConnector, false);

function initCMSConnector(aEvent) {
    dump("initCMSConnector() invoked\n");
    document.getElementById('attachmentMenuList').addEventListener('popupshowing', attachmentMenuListOnPopupShowingListener, false);
}

function attachmentMenuListOnPopupShowingListener(aEvent) {
    dump("attachmentMenuListOnPopupShowingListener() invoked");

    var canOpen             = false;
    var uploadMenu          = document.getElementById('context-uploadAttachmentToCMS');
    var attachmentList      = document.getElementById('attachmentList');
    //var selectedAttachments = attachmentList.selectedItems;
    if (attachmentList.selectedItems.length != 0)
	uploadMenu.removeAttribute('disabled');
}

/**
 * Is called by the "Upload to CMS..." entry in the attachment
 * context menu. It uploads all selected attachments of a given
 * message while sequentially asking for the target node for every
 * attachment.
 *
 * @return void
 */
function uploadAttachmentToCMS() {
    var allAttachments = document.getElementById('attachmentList');

    /* All selected attachments are live attachments by definition, because if they were
     * not live, they could not have been selected in the first place. */
    var selectedAttachments = allAttachments.selectedItems;

    // aggregate all selected attachments

    // maybe we need the same hack as in http://lxr.mozilla.org/mozilla/source/mail/base/content/msgHdrViewOverlay.js#1115
    for (var i = 0; i < selectedAttachments.length; i++) {
	try {
	    __uploadAttachment(selectNode(), selectedAttachments[i].attachment);
	} catch (exception) {
	    if (exception instanceof CMSConnectorExecutionException) {
		dump("uploadAttachmentToCMS: " + exception.name + " - " + exception.message + "\n");
		return;
	    }
	    else if (exception instanceof CMSConnectorAbortException) {
		// REMOVE for production version, since this is not an error condition
		dump("uploadAttachmentToCMS: " + exception.name + " - " + exception.message + "\n");
		return;
	    }
	}
    }
}

/**
 * Is called by the "Upload All to CMS..." entry in the attachment
 * context menu. It uploads all attachments of a given message
 * to the same node.
 * <p>
 * Note that currentAttachment and cloneAttachment() come from
 * chrome://messenger/content/msgHdrViewOverlay.js.
 *
 * @return void
 */
function uploadAllAttachmentsToCMS() {
    var CMSNode;
    var liveAttachments = new Array();

    dump("uploadAllAttachmentsToCMS: currentAttachments \"" + currentAttachments + "\"\n");

    /* Filter out all removed attachments. currentAttachments holds
     * all atachments of the current message. */
    for (var i = 0; i < currentAttachments.length; i++)
        if (currentAttachments[i].contentType != 'text/x-moz-deleted')
	    liveAttachments.push(cloneAttachment(currentAttachments[i]));

    // upload all attachments to the same node
    try {
	CMSNode = selectNode();
    } catch (exception) {
	if (exception instanceof CMSConnectorExecutionException) {
	    dump("uploadAllAttachmentsToCMS: " + exception.name + " - " + exception.message + "\n");
	    return;
	}
	else if (exception instanceof CMSConnectorAbortException) {
	    // REMOVE for production version, since this is not an error condition
	    dump("uploadAllAttachmentsToCMS: " + exception.name + " - " + exception.message + "\n");
	    return;
	}
    }

    /* Iteration over all live attachments is separated from the filtering above
     * on purpose, because we want to be able to do asynchronous uploads. If uploading
     * was done in the same step as the filtering, the upload must be synchronous,
     * otherwise there is no guarantee that an attachment scheduled for upload
     * still exists at the time the upload begins. */
    for (var i = 0; i < liveAttachments.length; i++)
	__uploadAttachment(CMSNode, liveAttachments[i]);
}

/**
 * Uploads aAttachment to aCMSNode.
 *
 * @param  aCMSNode    the node where the attachment should be stored in the CMS
 * @param  aAttachment the attachment to upload
 * @return void
 * @throws CMSConnectorAbortException
 * @throws CMSConnectorExecutionException
 */
function __uploadAttachment(aCMSNode, aAttachment) {
    alert("__uploadAttachment() invoked\n\naAttachment.contentType: " + aAttachment.contentType + "\n" +
	  "aAttachment.url: " + aAttachment.url + "\n" +
	  "aAttachment.displayName: " + aAttachment.displayName + "\n" +
	  "aAttachment.messageUri: " + aAttachment.messageUri + "\n" +
	  "aAttachment.isExternalAttachment: " + aAttachment.isExternalAttachment);
}