(() => {
  'use strict';

  const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));

  const createLocalStore = ({ key, version, createInitial }) => {
    const read = () => {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return createInitial();
      }
      const envelope = JSON.parse(raw);
      if (envelope.version !== version) {
        throw new Error(`状态版本不匹配：${envelope.version} !== ${version}`);
      }
      return envelope.data;
    };

    const write = data => {
      const envelope = { version, updatedAt: Date.now(), data };
      localStorage.setItem(key, JSON.stringify(envelope));
      return data;
    };

    return { key, version, read, write };
  };

  const mergeLatestByKey = (current, updates, keyOf) => {
    const updateKeys = new Set(updates.map(keyOf));
    return updates.concat(current.filter(item => !updateKeys.has(keyOf(item))));
  };

  const rebuildLatestByKey = (messages, parseMessage, keyOf) => {
    const seen = new Set();
    const records = [];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const updates = parseMessage(messages[index]);
      if (updates === null) {
        continue;
      }
      updates.forEach(item => {
        const key = keyOf(item);
        if (!seen.has(key)) {
          seen.add(key);
          records.push(item);
        }
      });
    }
    return records;
  };

  const rebuildUniqueByKey = (messages, parseMessage, keyOf) => {
    const seen = new Set();
    const records = [];
    messages.forEach(message => {
      const updates = parseMessage(message);
      if (updates === null) {
        return;
      }
      updates.forEach(item => {
        const key = keyOf(item);
        if (!seen.has(key)) {
          seen.add(key);
          records.push(item);
        }
      });
    });
    return records;
  };

  const createMmdHistoryLoader = () => {
    const getScrollContainer = () => document.querySelectorAll('.uni-scroll-view')[1];
    const isLoading = () => document.querySelector('.loading-warpper') !== null;

    const scrollTop = () => {
      const container = getScrollContainer();
      container.scrollTop = 0;
      container.scrollTo({ top: 0 });
      container.dispatchEvent(new Event('scroll', { bubbles: true }));
    };

    const scrollBottom = () => {
      const container = getScrollContainer();
      const top = container.scrollHeight;
      container.scrollTop = top;
      container.scrollTo({ top });
      container.dispatchEvent(new Event('scroll', { bubbles: true }));
    };

    const loadAll = async isCurrent => {
      while (isCurrent()) {
        scrollTop();
        await sleep(100);
        if (!isLoading()) {
          break;
        }
        while (isCurrent() && isLoading()) {
          await sleep(100);
        }
        await sleep(300);
      }
    };

    return { loadAll, scrollTop, scrollBottom };
  };

  const createReplyPoller = ({ parseMessage, onUpdate }) => {
    let observer = null;
    let timer = null;
    let lastFingerprint = '';

    const isVisible = node => {
      const style = window.getComputedStyle(node);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };

    const getLatestStableMessage = () => {
      const replies = document.querySelectorAll('.item.Ai');
      if (replies.length < 2) {
        return null;
      }
      const reply = replies[replies.length - 2];
      const stable = Array.from(reply.querySelectorAll('.modify-btn')).some(isVisible);
      return stable ? reply.querySelector('.content.left') : null;
    };

    const apply = message => {
      const fragment = parseMessage(message);
      if (fragment === null) {
        return false;
      }
      const fingerprint = JSON.stringify(fragment);
      if (fingerprint === lastFingerprint) {
        return false;
      }
      lastFingerprint = fingerprint;
      onUpdate(fragment, message);
      return true;
    };

    const tick = () => {
      const message = getLatestStableMessage();
      return message === null ? false : apply(message);
    };

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        tick();
      }, 1000);
    };

    const stop = () => {
      clearTimeout(timer);
      timer = null;
      if (observer !== null) {
        observer.disconnect();
        observer = null;
      }
    };

    const start = () => {
      stop();
      observer = new MutationObserver(schedule);
      observer.observe(document.querySelector('#msglistview.chat-body'), {
        childList: true,
        subtree: true,
        characterData: true
      });
      schedule();
    };

    return { start, stop, tick, schedule, apply };
  };

  const createStateManager = ({
    storageKey,
    version,
    createInitial,
    parseMessage,
    mergeIncremental,
    rebuildHistory,
    render
  }) => {
    const store = createLocalStore({ key: storageKey, version, createInitial });
    const history = createMmdHistoryLoader();
    let refreshId = 0;

    const commit = fragment => {
      const next = mergeIncremental(store.read(), fragment);
      store.write(next);
      render(next);
      return next;
    };

    const poller = createReplyPoller({ parseMessage, onUpdate: commit });

    const read = () => store.read();

    const applyLatest = message => poller.apply(message);

    const cancelRefresh = () => {
      refreshId += 1;
    };

    const refreshAll = async () => {
      const currentId = refreshId + 1;
      refreshId = currentId;
      await history.loadAll(() => refreshId === currentId);
      if (refreshId !== currentId) {
        return false;
      }
      const messages = Array.from(document.querySelectorAll('.content.left'));
      const rebuilt = rebuildHistory(messages, parseMessage);
      if (refreshId !== currentId) {
        return false;
      }
      store.write(rebuilt);
      render(rebuilt);
      history.scrollBottom();
      return true;
    };

    const start = () => {
      render(store.read());
      poller.start();
    };

    const stop = () => {
      poller.stop();
      cancelRefresh();
    };

    return { start, stop, read, applyLatest, refreshAll, cancelRefresh };
  };

  window.GlobalStateMaintenance = {
    createLocalStore,
    mergeLatestByKey,
    rebuildLatestByKey,
    rebuildUniqueByKey,
    createMmdHistoryLoader,
    createReplyPoller,
    createStateManager
  };
})();
