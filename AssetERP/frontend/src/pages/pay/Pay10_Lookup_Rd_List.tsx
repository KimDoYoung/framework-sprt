/**
 * 급여대장 RD 보기 폼 (S18) — Pay10_Tab_List의 가운데 영역.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_Rd_List.java (75줄) — retrieve(payCode, payDate, fileName) L27-54: RD HTML5 페이지
 *   `…/RDhtml/Pay10_Rd_List.html?companyId&dbName&dns&personId&payCode&payDate&fileName`를 폼 안에 끼워 넣는다 (payDate가 없으면 sample.html).
 * 주소는 서버가 만든다(`rdApi.buildUrl({kind:'page'})`, companyId·personId는 로그인 값). 이 부품은 받은 주소를 iframe으로 보일 뿐이다.
 * rdClear() L56-58 = url을 null로 비운다. 나머지 retrieve/update/insertRow/deleteRow(L61-74)는 빈 구현이다
 */
import React from 'react';

interface Props {
  /** 보고서 주소 — null이면 비어 있다(AS-IS sample.html 자리) */
  url: string | null;
}

// [E0] 화면 열림 (생성자) → 폼 안에 RD 영역을 만든다. 주소는 부르는 쪽(Pay10_Tab_List.retrieve)이 정해 준다
export const Pay10_Lookup_Rd_List: React.FC<Props> = ({ url }) => (
  <div style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
    {url && <iframe title="급여대장" src={url} style={{ border: 0, width: '100%', height: '100%' }} />}
  </div>
);
