import { createContext, useContext } from 'react';
import { User } from '../types/auth';

/** 로그인 사용자 (MainFrame이 제공). 화면에서 회사·권한에 따라 버튼을 막을 때 쓴다 — 실제 권한 검사는 서버가 한다 */
export const LoginUserContext = createContext<User | null>(null);

export function useLoginUser(): User {
  const user = useContext(LoginUserContext);
  if (!user) throw new Error('LoginUserContext가 없습니다 (MainFrame 밖에서 사용)');
  return user;
}

/** KFS 관리자 (admin 회사 회사관리자) — 전 고객사 데이터를 다룬다 */
export const isSysAdmin = (user: User) => user.roles.includes('ROLE_SYSADMIN');
