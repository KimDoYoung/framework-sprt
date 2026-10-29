/**
 * [1278] 경영관리 > 04. 급여관리 > 급여기초정보 (S29)
 * 스타일: TP (껍데기 — 부모 Pay20_Tab_DeductAdmin을 따른다)
 * AS-IS: myApp/client/vi/pay/Pay20_Tab_Deduct.java — `Pay20_Tab_DeductAdmin`(E22, 메뉴 1279)과 클래스 이름만 다르고 코드가 같다
 * (diff: 클래스명·생성자명 2줄). 탭 9개·하위 클래스 25개·API는 E22가 모두 옮겼으므로 껍데기를 그대로 쓴다.
 * 관리자 회사만 등록·저장·삭제 버튼을 여는 판정은 각 탭 페이지가 로그인 회사(companyId === 0)로 한다 — 이 메뉴는 고객사가 열어 조회한다.
 * [E0]·[E1]은 `Pay20_Tab_DeductAdmin.tsx`의 주석(탭 9개 추가·retrieveTabpage)과 같다.
 */
import React from 'react';
import { Pay20_Tab_DeductAdmin } from './Pay20_Tab_DeductAdmin';

// [E0] 화면 열림 (생성자 L20-72) → 탭 9개 추가 — Pay20_Tab_DeductAdmin 껍데기
// [E1] tabPanel.Selection [arg0 != null] (L22) → retrieveTabpage() L74-77 — Pay20_Tab_DeductAdmin 껍데기
export const Pay20_Tab_Deduct: React.FC = () => <Pay20_Tab_DeductAdmin />;
