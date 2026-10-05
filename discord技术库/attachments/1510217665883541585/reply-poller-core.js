var CONTENT_KEY_TRUSTED_CLASSES = [
    '__FILL_TRUSTED_CLASS_1__',
    '__FILL_TRUSTED_CLASS_2__'
];
var OBSERVER_DEBOUNCE_MS = 1000;

function handleQualifiedReplyUpdate(contentNodes, contentKey) {
    function findFromLatest(selector) {
        var i;
        var foundList;
        for (i = contentNodes.length - 2; i >= 0; i = i - 1) {
            if (!contentNodes[i]) {
                continue;
            }
            foundList = contentNodes[i].querySelectorAll(selector);
            if (foundList.length === 1) {
                return foundList[0];
            }
            if (foundList.length > 1) {
                return foundList;
            }
        }
        return null;
    }

    /*
    本功能用于检测AI对话最新回复的内容发生变化，并用于处理如独立界面、缓存数据等依赖“最新状态”的功能。
    在此处填写当检测到回复内容更新时需要执行的操作。主要为抓取最新回复内容中的目标元素并进行相应处理。
    建议使用 findFromLatest(selector) 从最新回复正文开始向上检索目标元素。
    */
}

var previousCore = window.replyPollerCore || {};
var core = {
    timer: previousCore.timer || null,
    observer: previousCore.observer || null,
    lastContentKey: previousCore.lastContentKey || ''
};
var CONTENT_KEY_IGNORED_TAGS = {
    STYLE: true,
    SCRIPT: true,
    IFRAME: true,
    OBJECT: true,
    EMBED: true,
    LINK: true,
    META: true
};
var TRUSTED_CLASS_LOOKUP = buildTrustedClassLookup();

function trimText(text) {
    return String(text == null ? '' : text).replace(/^\s+|\s+$/g, '');
}

function getReplyItems() {
    return document.querySelectorAll('.item.Ai');
}

function getLatestReplyContentNode(replyItem) {
    if (!replyItem) {
        return null;
    }
    return replyItem.querySelector('.content.left');
}

function getReplyContentNodes() {
    return document.querySelectorAll('.content.left');
}

function getLatestReplyModifyButtons(replyItem) {
    if (!replyItem) {
        return [];
    }
    return replyItem.querySelectorAll('.modify-btn');
}

function buildTrustedClassLookup() {
    var lookup = {};
    var i;
    var className;
    for (i = 0; i < CONTENT_KEY_TRUSTED_CLASSES.length; i = i + 1) {
        className = CONTENT_KEY_TRUSTED_CLASSES[i];
        if (className) {
            lookup[className] = true;
        }
    }
    return lookup;
}

function hasTrustedClass(node, trustedLookup) {
    var i;
    var classList;
    if (!node || node.nodeType !== 1 || !trustedLookup) {
        return false;
    }
    classList = node.classList;
    if (!classList || !classList.length) {
        return false;
    }
    for (i = 0; i < classList.length; i = i + 1) {
        if (trustedLookup[classList[i]]) {
            return true;
        }
    }
    return false;
}

function isIgnoredTag(node) {
    return !!(node && node.nodeType === 1 && CONTENT_KEY_IGNORED_TAGS[node.tagName]);
}

function collectStableText(rootNode) {
    var stack;
    var parts;
    var node;
    var child;

    if (!rootNode) {
        return '';
    }

    stack = [rootNode];
    parts = [];

    while (stack.length) {
        node = stack.pop();
        if (!node) {
            continue;
        }
        if (node.nodeType === 3) {
            parts.push(String(node.nodeValue == null ? '' : node.nodeValue));
            continue;
        }
        if (node.nodeType !== 1 || isIgnoredTag(node) || hasTrustedClass(node, TRUSTED_CLASS_LOOKUP)) {
            continue;
        }
        child = node.lastChild;
        while (child) {
            stack.push(child);
            child = child.previousSibling;
        }
    }

    return parts.join('');
}

function buildReplyContentKey(contentNode) {
    if (!contentNode) {
        return '';
    }
    return trimText(collectStableText(contentNode)).replace(/\s+/g, ' ');
}

function buildLatestReplyContentKey(replyItem) {
    return buildReplyContentKey(getLatestReplyContentNode(replyItem));
}

function isElementVisible(node) {
    var style;
    if (!node || !node.ownerDocument || !node.ownerDocument.documentElement.contains(node)) {
        return false;
    }
    style = window.getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

function hasVisibleModifyButton(replyItem) {
    var buttons = getLatestReplyModifyButtons(replyItem);
    var i;
    for (i = 0; i < buttons.length; i = i + 1) {
        if (isElementVisible(buttons[i])) {
            return true;
        }
    }
    return false;
}

function tickReplyPoller() {
    var replyItems = getReplyItems();
    var replyItem;
    var contentNode;
    var contentKey;

    if (!replyItems || replyItems.length < 2) {
        return;
    }

    replyItem = replyItems[replyItems.length - 2] || null;
    if (!replyItem) {
        return;
    }

    contentNode = getLatestReplyContentNode(replyItem);
    if (!contentNode || !(hasVisibleModifyButton(replyItem) || replyItems.length === 3)) {
        return;
    }

    contentKey = buildLatestReplyContentKey(replyItem);
    if (!contentKey || core.lastContentKey === contentKey) {
        return;
    }

    core.lastContentKey = contentKey;
    handleQualifiedReplyUpdate(getReplyContentNodes(), contentKey);
}

function scheduleReplyPollerTick() {
    if (core.timer) {
        clearTimeout(core.timer);
    }
    core.timer = setTimeout(function() {
        core.timer = null;
        tickReplyPoller();
    }, OBSERVER_DEBOUNCE_MS);
}

function getObserverRoot() {
    return document.querySelector('#msglistview.chat-body');
}

function initReplyPollerCore() {
    var observerRoot;
    if (core.observer) {
        core.observer.disconnect();
    }
    if (core.timer) {
        clearTimeout(core.timer);
    }
    observerRoot = getObserverRoot();
    if (!observerRoot) {
        core.timer = null;
        return;
    }
    core.timer = null;
    core.observer = new MutationObserver(scheduleReplyPollerTick);
    core.observer.observe(observerRoot, {
        childList: true,
        subtree: true,
        characterData: true
    });
    scheduleReplyPollerTick();
}

Object.assign(core, {
    start: initReplyPollerCore,
    tick: tickReplyPoller,
    schedule: scheduleReplyPollerTick,
    collectStableText: collectStableText,
    buildReplyContentKey: buildReplyContentKey
});
window.replyPollerCore = core;
core.start();