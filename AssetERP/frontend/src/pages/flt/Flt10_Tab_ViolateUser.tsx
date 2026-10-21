/**
 * 위반내역조회 (I10) — 준법감시 > 10. 임직원매매 > 위반내역조회 #1370
 * AS-IS: myApp/client/vi/flt/Flt10_Tab_ViolateUser.java(9줄) — Flt10_Tab_Violate를 상속해 사원명 칸을 막고(L6) 열릴 때 조회한다(L7)
 */
import React from 'react';
import { Flt10_Tab_Violate } from './Flt10_Tab_Violate';

// [E0] 화면 열림 (생성자 L5-8) → empKorName.setEnabled(false), retrieve()
export const Flt10_Tab_ViolateUser: React.FC = () => <Flt10_Tab_Violate fixedUser />;
