/**
 * 급여명세서 RD 보기 폼 (S20·S21) — Pay10_Tab_PersonList·Pay10_Tab_PersonListManager의 가운데 영역.
 * AS-IS: myApp/client/vi/pay/Pay10_Rd_PersonList.java (44줄) — retrieve(monthId, date, num) L20-37: RD 뷰어(mrd Pay10_Rd_PersonList,
 *   rv monthId·date·num)를 폼 안에 끼워 넣는다. rdClear() L39-41 = 비운다.
 * 주소는 부르는 쪽이 `rdApi.buildUrl({kind:'viewer'})`로 받아 준다(companyId·personId는 서버가 로그인 값으로). 이 부품은 받은 주소를 iframe으로 보일 뿐이다
 */
import React from 'react';

interface Props {
  /** 보고서 주소 — null이면 비어 있다(rdClear) */
  url: string | null;
}

// [E0] 화면 열림 (생성자 L16-18) → 폼 안에 RD 영역을 만든다. 주소는 부르는 쪽이 정해 준다
export const Pay10_Rd_PersonList: React.FC<Props> = ({ url }) => (
  <div style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
    {url && <iframe title="급여명세서" src={url} style={{ border: 0, width: '100%', height: '100%' }} />}
  </div>
);
