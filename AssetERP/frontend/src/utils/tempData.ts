/**
 * 화면 사이 값 전달 + 다른 메뉴 탭 열기 (AS-IS TempData + MenuOpener.openTabCallback)
 *
 * AS-IS: 보내는 화면이 TempData.setXxx(값)을 채우고 `MenuOpener.openTabCallback(탭패널, "화면번호", result → 받는화면.메서드())`로
 *        탭을 열면(이미 열려 있으면 그 탭) 받는 화면 인스턴스의 메서드를 불러 TempData를 읽게 했다.
 * TOBE: 보내는 화면 `if (!openMenuByNo('1011')) return; TempData.publish('apr.subList', 값)`
 *       받는 화면 `useEffect(() => TempData.subscribe('apr.subList', 값 => …), [])` — 열려 있으면 바로, 아직 안 떴으면 뜰 때 받는다.
 */
type Listener = (value: never) => void;

const pending = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();

export const TempData = {
  /** 값을 보낸다. 받는 화면이 열려 있으면 바로 전달하고, 아니면 받는 화면이 뜰 때까지 들고 있다 */
  publish<T>(key: string, value: T): void {
    const subs = listeners.get(key);
    if (subs && subs.size > 0) {
      subs.forEach(fn => (fn as (v: T) => void)(value));
    } else {
      pending.set(key, value);
    }
  },

  /** 받는다. 구독하는 즉시 기다리고 있던 값이 있으면 한 번 전달한다. 돌려주는 함수가 구독 해제 */
  subscribe<T>(key: string, fn: (value: T) => void): () => void {
    const subs = listeners.get(key) ?? new Set<Listener>();
    subs.add(fn as Listener);
    listeners.set(key, subs);
    if (pending.has(key)) {
      const value = pending.get(key) as T;
      pending.delete(key);
      fn(value);
    }
    return () => { subs.delete(fn as Listener); };
  },
};

type MenuOpener = (menuNo: string) => boolean;
let opener: MenuOpener | null = null;

/** MainFrame이 한 번 등록한다. 돌려주는 함수가 해제 */
export function registerMenuOpener(fn: MenuOpener): () => void {
  opener = fn;
  return () => { if (opener === fn) opener = null; };
}

/** 화면번호(sys06_menu_no)로 탭을 연다(이미 열려 있으면 그 탭을 선택). 내 메뉴에 없는 화면이면 false */
export function openMenuByNo(menuNo: string): boolean {
  return opener ? opener(menuNo) : false;
}
