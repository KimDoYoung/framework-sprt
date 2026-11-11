import { useEffect, useRef } from 'react';

/**
 * 전역 단축키 (TOBE 재설계 04, docs/4-재설계/04-키보드-단축키.md). 라이브러리 없이 처리기 하나.
 *
 * | 키           | 동작                      |
 * | Alt+X        | 현재 탭 닫기              |
 * | Alt+Shift+X  | 모든 탭 닫기 (확인창)     |
 * | Esc          | 화면번호 입력칸으로 이동  |
 * | F4           | 최대화·복원               |
 * | F9           | 나의 화면 목록 열기·닫기  |
 *
 * - 물리 키(e.code)로 판정 → 한글 입력 상태에서도 동작. 한글 조합 중(isComposing)이면 무시.
 * - Alt+X·F4·F9 는 capture 단계(그리드·입력칸이 이벤트를 먹기 전)에 받는다.
 * - Esc 는 bubble 단계에서 받고, 팝업·드롭다운·그리드 편집 등 Esc 를 쓰는 것이 열려 있으면 양보한다.
 * - Ctrl+W·Ctrl+Shift+W 는 브라우저가 먼저 가져가 웹페이지에서 쓸 수 없어 Alt+X 를 쓴다.
 */
export interface GlobalHotkeyActions {
  closeCurrentTab: () => void;
  closeAllTabs: () => void;
  focusScreenSearch: () => void;
  toggleMaximize: () => void;
  toggleMyScreen: () => void;
}

/** 화면에 보이는 요소인지 (display:none 이면 rect 가 없다) */
const isShown = (el: Element) => el.getClientRects().length > 0;

/** Esc 를 먼저 써야 하는 것이 열려 있는가 — 열려 있으면 Esc 를 양보한다 */
const ESC_OWNERS: Array<[selector: string, hiddenClass?: string]> = [
  ['.ant-modal-wrap'],
  ['.ant-drawer-open'],
  ['.ant-image-preview-wrap'],
  ['.ant-select-dropdown', 'ant-select-dropdown-hidden'],
  ['.ant-dropdown', 'ant-dropdown-hidden'],
  ['.ant-picker-dropdown', 'ant-picker-dropdown-hidden'],
  ['.ant-cascader-dropdown', 'ant-select-dropdown-hidden'],
  ['.ant-popover', 'ant-popover-hidden'],
  ['.ag-popup'],
  ['.ag-cell-inline-editing'],
  ['.ag-popup-editor'],
];
export const isEscapeInUse = (): boolean =>
  ESC_OWNERS.some(([sel, hidden]) =>
    Array.from(document.querySelectorAll(sel)).some(el => (!hidden || !el.classList.contains(hidden)) && isShown(el)),
  );

// 실제 글자 조합 중일 때만 무시한다. keyCode 229 는 보지 않는다 — 리눅스 Chrome 은 한글 입력기(fcitx·ibus)가 켜져 있으면
// 조합하지 않을 때도 모든 키를 229("Process")로 보내 Esc 가 먹히는 것처럼 보였다(2026-11-11). e.code 는 그때도 물리 키다.
const composing = (e: KeyboardEvent) => e.isComposing;
const noMods = (e: KeyboardEvent) => !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;

export function useGlobalHotkeys(actions: GlobalHotkeyActions) {
  const ref = useRef(actions);
  ref.current = actions;

  useEffect(() => {
    const onCapture = (e: KeyboardEvent) => {
      if (composing(e)) return;
      const a = ref.current;
      if (e.code === 'KeyX' && e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return; // 누르고 있어도 한 번만
        if (e.shiftKey) a.closeAllTabs();
        else a.closeCurrentTab();
        return;
      }
      if (e.code === 'F9' && noMods(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) a.toggleMyScreen();
        return;
      }
      if (e.code === 'F4' && noMods(e)) {
        e.preventDefault();
        if (!e.repeat) a.toggleMaximize();
      }
    };

    const onBubble = (e: KeyboardEvent) => {
      if (e.code !== 'Escape' || !noMods(e) || composing(e)) return;
      if (isEscapeInUse()) return;
      ref.current.focusScreenSearch();
    };

    window.addEventListener('keydown', onCapture, true);
    window.addEventListener('keydown', onBubble);
    return () => {
      window.removeEventListener('keydown', onCapture, true);
      window.removeEventListener('keydown', onBubble);
    };
  }, []);
}
