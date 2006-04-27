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

const XMOZ_DELETED_MIME_TYPE = "text/x-moz-deleted"

/* Registers our init code to be run (see
 * http://developer.mozilla.org/en/docs/Extension_FAQ#Why_doesn.27t_my_script_run_properly.3F) */
window.addEventListener('load', initCMSConnector, false);

/**
 * Event handler for setting up CMSConnector for active message instance.
 *
 * @return {Undefined}
 */
function initCMSConnector() {
    // /* DEBUG */ dump("CMSConnector:cmsconnector.js:initCMSConnector() invoked\n");

    document.getElementById('attachmentListContext').addEventListener('popupshowing', attachmentListContextOnPopupShowingListener, false);
    document.getElementById('attachmentMenuList').addEventListener('popupshowing', attachmentMenuListOnPopupShowingListener, false);
}

/**
 * Event handler for updating the context menu
 * depending on the state of the selected attachments.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal property
 * document.getElementById('attachmentList').selectedItems[].attachment.
 *
 * @return {Undefined}
 */
function attachmentListContextOnPopupShowingListener() {
    // /* DEBUG */ dump("CMSConnector:cmsconnector.js:attachmentListContextOnPopupShowingListener() invoked\n");

    var uploadMenuitem    = document.getElementById('context-uploadAttachmentToCMS');
    var uploadAllMenuitem = document.getElementById('context-uploadAllAttachmentsToCMS');
    var attachmentList    = document.getElementById('attachmentList');

    uploadMenuitem.setAttribute('disabled', 'true');
    uploadAllMenuitem.setAttribute('disabled', 'true');

    /* Check if there are any attachments selected at all, and if
     * yes, check if there is at least one attachment in the selection
     * which is eligible for upload (i.e. not marked as deleted). */
    for (var i = 0; i < attachmentList.selectedItems.length; i++) {
        if (attachmentList.selectedItems[i].attachment.contentType != XMOZ_DELETED_MIME_TYPE) {
            uploadMenuitem.removeAttribute('disabled');
            break;
        }
    }

    if (existsEligibleAttachment())
        uploadAllMenuitem.removeAttribute('disabled');
}

/**
 * Event handler for updating the File -> Attachments menu
 * depending on the state of the selected attachments.
 *
 * @return {Undefined}
 */
function attachmentMenuListOnPopupShowingListener() {
    // /* DEBUG */ dump("CMSConnector:cmsconnector.js:attachmentMenuListOnPopupShowingListener() invoked\n");

    var uploadAllMenuitem = document.getElementById('file-uploadAllAttachmentsToCMS');

    uploadAllMenuitem.setAttribute('disabled', 'true');

    if (existsEligibleAttachment())
        uploadAllMenuitem.removeAttribute('disabled');
}

/**
 * Test if at least one attachment is eligible for upload.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal global
 * object property currentAttachments.
 * <p>
 * currentAttachments is defined in
 * chrome://messenger/content/msgHdrViewOverlay.js.
 *
 * @return {Boolean} returns true if at least one eligible attachment exists
 */
function existsEligibleAttachment() {
    /* Check if there is at least one attachment at all (i.e. not only
     * among the selection), which is eligible for upload (i.e. not marked
     * as deleted). */
    for (var i = 0; i < currentAttachments.length; i++) {
        if (currentAttachments[i].contentType != "text/x-moz-deleted")
            return true;
    }
    return false;
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
 * @return {Undefined}
 */
function uploadAttachmentToCMS() {
    var liveAttachments = new Array();

    // get selected attachments
    var attachmentList = document.getElementById('attachmentList');

    // filter out deleted attachments
    for (var i = 0; i < attachmentList.selectedItems.length; i++)
        __filterDeletedAttachments(liveAttachments, attachmentList.selectedItems[i].attachment);

    // check if there are any live attachments left to process
    if (liveAttachments.length != 0) {
        // maybe we need the same hack as in http://lxr.mozilla.org/mozilla/source/mail/base/content/msgHdrViewOverlay.js#1115
        for (var i = 0; i < liveAttachments.length; i++) {
            try {
                __uploadAttachment(NodeSelector.selectNode(), liveAttachments[i]);
            } catch (exception) {
                if (exception instanceof CMSConnectorAbortException) {
                    /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAttachmentToCMS: " + exception.toString() + "\n");
                    return;
                } else {
                    // not a normal abruption
                    dump("CMSConnector:cmsconnector.js:uploadAttachmentToCMS: " + exception.toString() + "\n");
                    return;
                }
            }
        }
    } else dump("CMSConnector:cmsconnector.js:uploadAttachmentToCMS: No attachments to upload. This condition should never occur. " + CMSCONNECTOR_REPORT_BUG + "\n")
}

/**
 * Called by the "Upload All to CMS..." entry in the attachment
 * context menu. Uploads all attachments of a given message
 * to the same node.
 * <p>
 * This function relies on Mozilla internal implementation
 * details because of referencing the internal global object
 * property currentAttachments.
 * <p>
 * currentAttachments is defined in
 * chrome://messenger/content/msgHdrViewOverlay.js.
 *
 * @return {Undefined}
 */
function uploadAllAttachmentsToCMS() {
    var CMSNode         = null;
    var liveAttachments = new Array();

    /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: self.currentAttachments \"" + self.currentAttachments + "\"\n");

    // filter out attachments marked as deleted
    for (var i = 0; i < currentAttachments.length; i++)
        __filterDeletedAttachments(liveAttachments, self.currentAttachments[i]);

    // check if there are any live attachments left to process
    if (liveAttachments.length != 0) {
        // upload all attachments to the same node
        try {
            CMSNode = NodeSelector.selectNode();
        } catch (exception) {
            if (exception instanceof CMSConnectorAbortException) {
                /* DEBUG */ dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: " + exception.toString() + "\n");
                return;
            } else {
                // not a normal abruption
                dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: " + exception.toString() + "\n");
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
    } else dump("CMSConnector:cmsconnector.js:uploadAllAttachmentsToCMS: No attachments to upload. This condition should never occur. " + CMSCONNECTOR_REPORT_BUG + "\n")
}

/**
 * Upload an attachment to a specific node on the CMS.
 *
 * @private
 * @param  {Object}     aCMSNode    the node where the attachment should be stored in the CMS
 * @param  {Attachment} aAttachment the attachment to upload
 * @return {Undefined}
 * @throws {Error}      CMSConnectorAbortException
 * @throws {Error}      CMSConnectorExecutionException
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
 * @private
 * @param  {Array}     aArray      the array into which accepted attachments should be stored
 * @param  {Object}    aAttachment the attachment to test
 * @return {Undefined}
 */
function __filterDeletedAttachments(aArray, aAttachment) {
    if (aAttachment.contentType != XMOZ_DELETED_MIME_TYPE)
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
 * @private
 * @param  {Object}     aAttachment the attachment to clone
 * @return {Attachment}             a newly created object of type Attachment
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
