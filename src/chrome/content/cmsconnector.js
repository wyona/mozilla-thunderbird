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
 * This module contains the glue code to dispatch the upload actions.
 * <p>
 * The code in this module serves to separate the internal Mozilla
 * mail implementation from the rest of the CMSConnector code to
 * render it implementation indepedendent.
 */

const XMOZDELETEDMIMETYPE = 'text/x-moz-deleted'

/* Registers our init code to be run (see
 * http://developer.mozilla.org/en/docs/Extension_FAQ#Why_doesn.27t_my_script_run_properly.3F) */
window.addEventListener('load', initCMSConnector, false);

/**
 * Event handler for setting up CMSConnector for active message instance.
 *
 * @param  aEvent the event by which this handler is triggered
 * @return undefined
 */
function initCMSConnector(aEvent) {
    /* DEBUG */ dump("CMSConnector:cmsconnector.js:initCMSConnector() invoked\n");

    document.getElementById('attachmentListContext').addEventListener('popupshowing', attachmentMenuListOnPopupShowingListener, false);
}

/**
 * Event handler for updating the context menu
 * depending on the state of the selected attachments.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal property
 * document.getElementById('attachmentList').selectedItems[].attachment.
 *
 * @param  aEvent the event by which this handler is triggered
 * @return undefined
 */
function attachmentMenuListOnPopupShowingListener(aEvent) {
    /* DEBUG */ dump("CMSConnector:cmsconnector.js:attachmentMenuListOnPopupShowingListener() invoked\n");

    var uploadMenu     = document.getElementById('context-uploadAttachmentToCMS');
    var attachmentList = document.getElementById('attachmentList');

    uploadMenu.setAttribute('disabled', 'true');

    /* Check if there are any attachments selected at all, and if
     * yes, check if there is at least one attachment in the selection
     * which is eligible for upload (i.e. not marked as deleted). */
    for (var i = 0; i < attachmentList.selectedItems.length; i++) {
        if (attachmentList.selectedItems[i].attachment.contentType != XMOZDELETEDMIMETYPE) {
            uploadMenu.removeAttribute('disabled');
            break;
        }
    }
}

/**
 * Called by the "Upload to CMS..." entry in the attachment
 * context menu. Uploads all selected attachments of a given
 * message while sequentially asking for the target node for every
 * attachment.
 * <p>
 * Note that there must at least one attachment be selected which
 * is not marked as deleted.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal property
 * document.getElementById('attachmentList').selectedItems[].attachment.
 *
 * @return undefined
 */
function uploadAttachmentToCMS() {
    var liveAttachments = new Array();

    // get selected attachments
    var attachmentList = document.getElementById('attachmentList');

    // filter out deleted attachments
    for (var i = 0; i < attachmentList.selectedItems.length; i++)
        __filterDeletedAttachments(liveAttachments, attachmentList.selectedItems[i].attachment);

    // maybe we need the same hack as in http://lxr.mozilla.org/mozilla/source/mail/base/content/msgHdrViewOverlay.js#1115
    for (var i = 0; i < liveAttachments.length; i++) {
        try {
            __uploadAttachment(selectNode(), liveAttachments[i]);
        } catch (exception) {
            if (exception instanceof CMSConnectorExecutionException) {
                dump("CMSConnector:cmsconnector.js:uploadAttachmentToCMS: " + exception.toString() + "\n");
                return;
            }
            else if (exception instanceof CMSConnectorAbortException) {
                /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAttachmentToCMS: " + exception.toString() + "\n");
                return;
            }
        }
    }
}

/**
 * Called by the "Upload All to CMS..." entry in the attachment
 * context menu. Uploads all attachments of a given message
 * to the same node.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal global
 * property currentAttachments.
 * <p>
 * currentAttachments is defined in
 * chrome://messenger/content/msgHdrViewOverlay.js.
 *
 * @return undefined
 */
function uploadAllAttachmentsToCMS() {
    var CMSNode         = null;
    var liveAttachments = new Array();

    /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: currentAttachments \"" + currentAttachments + "\"\n");

    // filter out attachments marked as deleted
    for (var i = 0; i < currentAttachments.length; i++)
        __filterDeletedAttachments(liveAttachments, currentAttachments[i]);

    // upload all attachments to the same node
    try {
        CMSNode = selectNode();
    } catch (exception) {
        if (exception instanceof CMSConnectorExecutionException) {
            dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: " + exception.toString() + "\n");
            return;
        }
        else if (exception instanceof CMSConnectorAbortException) {
            /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: " + exception.toString() + "\n");
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
 * @return undefined
 * @throws CMSConnectorAbortException
 * @throws CMSConnectorExecutionException
 */
function __uploadAttachment(aCMSNode, aAttachment) {
    alert("CMSConnector:cmsconnector.js:__uploadAttachment() invoked\n\n" +
          "aAttachment.name: " + aAttachment.name + "\n" +
          "aAttachment.contentType: " + aAttachment.contentType + "\n" +
          "aAttachment.uri: " + aAttachment.uri);
}

/**
 * Filter out all attachments marked as deleted.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal attachment
 * object.
 *
 * @param  aArray      the array into which accepted attachments should be stored
 * @param  aAttachment the attachment to test
 * @return undefined
 */
function __filterDeletedAttachments(aArray, aAttachment) {
    if (aAttachment.contentType != XMOZDELETEDMIMETYPE)
        aArray.push(__createAttachment(aAttachment));
}


/**
 * Create a new object of type CMSConnector Attachment.
 * This is not a performance penalty since the attachment
 * needs to be cloned anyway.
 * <p>
 * The creation of a custom attachment object decouples
 * further processing from Mozilla implementation details.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal attachment
 * object.
 *
 * @param  aAttachment the attachment to clone
 * @return Attachment  a newly created object of type Attachment
 */
function __createAttachment(aAttachment) {
    /* The Mozilla internal aAttachment object contains the
     * following properties:
     *   aAttachment.contentType
     *   aAttachment.url
     *   aAttachment.displayName
     *   aAttachment.messageUri
     *   aAttachment.isExternalAttachment */
    return new Attachment(aAttachment.displayName,
                          aAttachment.contentType,
                          aAttachment.url)
}
