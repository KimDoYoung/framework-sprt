/**
 * 로그인 뒤 문(2차 인증, 로그인 선택)을 이번 로그인(jti)에서 이미 지났는지 기억한다.
 * 새로고침은 같은 jti라 다시 묻지 않는다. 겸직전환은 새 jti를 받으므로 지난 표시를 새 jti로 옮긴다(passAll).
 */
export type LoginGate = 'secondaryAuth' | 'addTitle';

const key = (gate: LoginGate, jti: string) => `${gate}Ok:${jti}`;

export const loginGates = {
  isPassed(gate: LoginGate, jti: string): boolean {
    try { return sessionStorage.getItem(key(gate, jti)) === '1'; } catch { return false; }
  },
  pass(gate: LoginGate, jti: string): void {
    try { sessionStorage.setItem(key(gate, jti), '1'); } catch { /* 저장 못 해도 이번 화면은 연다 */ }
  },
  /** 이미 문을 지난 사용자가 겸직전환으로 새 토큰(jti)을 받았을 때 */
  passAll(jti: string): void {
    loginGates.pass('secondaryAuth', jti);
    loginGates.pass('addTitle', jti);
  },
};
