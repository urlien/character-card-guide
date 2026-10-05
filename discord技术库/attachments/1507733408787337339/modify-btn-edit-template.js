var editing = false;
var pendingTimer = null;


function modifyEditContent(html) {
    /*
    * 修改代码说明：
    * - 入参是当前编辑器的 innerHTML。
    * - 返回完整的、修改后的 innerHTML 字符串。
    * - 主要目的：在平台已生成的最新回复内容基础上，自动补写、修正或追加后续功能需要的内容和正则捕获内容。
    * - 应尽量保留原有 HTML 结构，只做增量修改。
    * - 不要把整段内容转成纯文本，也不要重建无关 HTML。
    * - 修改可以包括补完、新增、追加标签、局部替换等。
    * - 添加内容前建议先检查目标内容是否已经存在，避免重复追加。
    * - 注意：源码中直接写出的完整正则标签也会被平台提前替换，导致代码在运行前被破坏，注意向用户核对对应的正则表达式。
    * - 推荐：需要追加正则标签时，在运行时用字符串拼接或 String.fromCharCode 生成，不要在源码中直接出现完整标签。
    * - 不要在这里点击按钮、查询页面、启动定时器或写入全局状态。
    * - 修改时只生成本函数，去除本段注释，不需要修改和生成其他部分。
    */
    return html;
}

function finish(scope) {
    if (scope) {
        scope.style.transform = '';
    }
    editing = false;
}

function saveAndFinish(scope, saveButton) {
    if (!saveButton) {
        finish(scope);
        return;
    }

    setTimeout(function() {
        saveButton.click();
    }, 100);

    setTimeout(function() {
        finish(scope);
    }, 3000);
}

function wasDisplayNone(styleText) {
    return /(?:^|;)\s*display\s*:\s*none\s*(?:;|$)/i.test(String(styleText || ''));
}

function isAiModifyButton(button) {
    var item = button && button.closest ? button.closest('.item') : null;
    return !!(item && item.matches && item.matches('.item.Ai'));
}

function runEdit() {
    var buttons;
    var editButton;
    var scope;

    if (editing) {
        return;
    }
    editing = true;

    buttons = document.getElementsByClassName('modify-btn');
    editButton = buttons[buttons.length - 2];

    if (!editButton) {
        editing = false;
        return;
    }

    scope = document.querySelector('.msg-modify-scope');
    if (!scope) {
        editing = false;
        return;
    }
    scope.style.transform = 'scale(0.0001,0.0001)';

    editButton.click();

    setTimeout(function() {
        var editNodes;
        var editNode;
        var saveButton;
        var currentHtml;
        var nextHtml;

        editNodes = scope.querySelectorAll('.vditor-reset');
        editNode = editNodes[2];
        saveButton = scope.querySelector('.modify-btn');

        if (!saveButton) {
            finish(scope);
            return;
        }

        if (!editNode) {
            saveAndFinish(scope, saveButton);
            return;
        }

        try {
            currentHtml = editNode.innerHTML;
            nextHtml = modifyEditContent(currentHtml);
            if (typeof nextHtml !== 'string') {
                saveAndFinish(scope, saveButton);
                return;
            }
            editNode.innerHTML = nextHtml;
            editNode.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (error) {
            console.warn('[modify-btn edit template] modify failed', error);
            saveAndFinish(scope, saveButton);
            return;
        }

        saveAndFinish(scope, saveButton);
    }, 100);
}

function scheduleEdit() {
    if (editing) {
        return;
    }
    if (pendingTimer) {
        clearTimeout(pendingTimer);
    }

    pendingTimer = setTimeout(function() {
        pendingTimer = null;
        runEdit();
    }, 100);
}

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'style' &&
            mutation.target &&
            mutation.target.matches &&
            mutation.target.matches('.modify-btn') &&
            mutation.target.style &&
            mutation.target.style.display !== 'none' &&
            wasDisplayNone(mutation.oldValue)
        ) {
            if (!isAiModifyButton(mutation.target)) {
                return;
            }
            scheduleEdit();
        }
    });
});

observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true
});

window.__modifyBtnEditTemplateObserver = observer;
