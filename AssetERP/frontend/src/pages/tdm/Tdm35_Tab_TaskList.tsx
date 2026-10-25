/**
 * [1467] 책무 > 90. 책무관리현황 > 책무조회 (N26)
 * AS-IS: myApp/client/vi/tdm/Tdm35_Tab_TaskList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-106: 위 툴바(기준일) + 아래 4줄(라벨 155폭 · [엑셀다운로드]). 화면에 그리드는 없다 — buildGrid()(L155-168)의 grid는
 *   레이아웃에 붙지 않고(retrieve() L170-187의 결과는 화면에 나오지 않는다), [조회] 단추도 툴바에 연결되지 않았다(E2 도달 불가).
 * RD: 4개 모두 `rdDownload`(docs/RD-대책.md) — mrd만 다르고 나머지는 같다.
 */
import React, { useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { Button } from '@/components/button';
import { useLoginUser } from '@/hooks/useLoginUser';
import { rdDownload } from '@/utils/rdDownload';

/** 줄 라벨(L61-64)과 줄 사이 위쪽 여백(L97-100) */
const ROWS = [
  { key: 'role',    title: '1. 임원(직책) 정보',  top: 80 },
  { key: 'task',    title: '2. 책무 정보',        top: 70 },
  { key: 'check',   title: '3. 점검 항목',        top: 75 },
  { key: 'checkDt', title: '4. 이행점검 내역',    top: 75 },
] as const;

export const Tdm35_Tab_TaskList: React.FC = () => {
  const user = useLoginUser();
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());   // settings() L108-110: 기준일 = LoginUser.getToday()

  // getStdDateString() L326-328 · getStdDateYYYYMM() L330-332
  const getStdDateString = () => stdDate.format('YYYYMMDD');
  const getStdDateYYYYMM = () => stdDate.format('YYYY년 MM월');

  // createRdExcel01~04() L189-324 (UX-01: 단추가 끝날 때까지 스피너·중복 클릭 무시): RDUtil.download(page CommonInvokerDownload.jsp · options "/rxlsxdefault [1] /rxlspagezoom [70]"
  //   · 파일 "{회사명}_{제목}(yyyy년 MM월).xlsx" · rv companyId·personId·stdDate[·YYYYMM]) — 실패하면 "다운로드 실패" 메시지
  const createRdExcel = async (mrd: string, title: string, withYyyymm: boolean) => {
    try {
      const rv: Record<string, string> = { stdDate: getStdDateString() };
      if (withYyyymm) rv.YYYYMM = getStdDateYYYYMM();
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd,
        options: '/rxlsxdefault [1] /rxlspagezoom [70]',
        exportType: 'xlsx',
        fileName: `${user.companyName}_${title}(${getStdDateYYYYMM()}).xlsx`,
        rv,
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E3] download01Button[엑셀다운로드].Select (L129) → createRdExcel01() L189-221
  const createRdExcel01 = () => createRdExcel('Tdm35_Rd_RoleData', '임원(직책) 정보', false);
  // [E4] download02Button[엑셀다운로드].Select (L135) → createRdExcel02() L223-255
  const createRdExcel02 = () => createRdExcel('Tdm35_Rd_TaskInfoData', '책무 정보', false);
  // [E5] download03Button[엑셀다운로드].Select (L141) → createRdExcel03() L257-289
  const createRdExcel03 = () => createRdExcel('Tdm35_Rd_CheckItemData', '점검 항목', false);
  // [E6] download04Button[엑셀다운로드].Select (L147) → createRdExcel04() L291-324 (rv에 YYYYMM 추가)
  const createRdExcel04 = () => createRdExcel('Tdm35_Rd_CheckDetailData', '이행점검 세부내역', true);
  const handlers = [createRdExcel01, createRdExcel02, createRdExcel03, createRdExcel04];

  // [E0] 화면 열림 (생성자 L59-106) → settings(), retrieve() — retrieve()의 결과는 화면에 나오지 않아 호출하지 않는다
  // [E1 생략] searchText.KeyPress[Enter] (L114) — searchText는 툴바에 없다
  // [E2 생략] retrieveButton[조회].Select (L123) — 도달 불가 (retrieveButton 컬럼·툴바 미연결)

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
        <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          {/* buttonBar L66-69: 기준일 */}
          <div style={{ height: 50, borderBottom: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', boxSizing: 'border-box' }}>
            <span>기준일</span>
            <DatePicker style={{ width: 120 }} format="YYYY.MM.DD" allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          </div>
          {/* space 80 + row01~04 (L72-100) */}
          <div style={{ paddingTop: 80 }}>
            {ROWS.map((r, i) => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', marginTop: r.top, marginLeft: 50 }}>
                <div style={{ width: 155, marginRight: 5, textAlign: 'left', fontSize: 18, fontWeight: 'bold' }}>{r.title}</div>
                <Button type="download" onClick={handlers[i]}>엑셀다운로드</Button>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
};
