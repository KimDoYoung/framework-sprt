/**
 * [1361] 경영관리 > 20. 대외보고서 > 임직원 정보통신수단 (T20)
 * AS-IS: myApp/client/vi/bmt/Bmt12_Tab_EmpIct.java (204줄, 새 원본 IDMS-IC) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 생성자 L55-90: 가운데(여백 20, 테두리) = 툴바 왼쪽 80%(기준일자 · 검색 250 · [조회] [출력/다운로드]) + 오른쪽 20%([전산장비관리 바로가기]) + 그리드(SingleGrid)
 * [출력/다운로드]는 서비스 sys.Sys99_Print.insertRdEmplct → RDViewer.viewer(mrd Bmt12_Rd_Emplct) — `rdApi` + `RdViewer`.
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건 2개라 넣지 않는다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { bmtEmpIctApi } from '@/api/bmt';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BmtEmpIct } from '@/types/bmt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { RdViewer } from '@/components/lookup/RdViewer';
import { openMenuByNo } from '@/utils/tempData';

const gb = gbFor<BmtEmpIct>();
const DATE = 'YYYY-MM-DD';

export const Bmt12_Tab_EmpIct: React.FC = () => {
  const [stdDate, setStdDate] = useState(() => dayjs());       // settings() L94: 오늘
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BmtEmpIct[]>([]);
  const [loading, setLoading] = useState(false);
  const [rd, setRd] = useState<{ url: string; title: string } | null>(null);

  // retrieve() L185-199: bmt.Bmt12_PcHistory.selectEmpICT(companyId는 서버, stdDate, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await bmtEmpIctApi.search(stdDate.format(DATE), searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L55-90) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] downLoadButton[출력/다운로드].Select (L127) → 서비스 sys.Sys99_Print.insertRdEmplct(companyId, personId, "Bmt12_Tab_EmpIct", stdDate, searchText)
  //   → 성공이면 RDViewer.viewer(mrd Bmt12_Rd_Emplct · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·Date)
  const downLoad = async () => {
    setLoading(true);
    try {
      const groupId = await bmtEmpIctApi.rdPrint(stdDate.format(DATE), searchText);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Bmt12_Rd_Emplct',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, Date: stdDate.format(DATE) },
      });
      setRd({ url: res.url, title: '임직원 정보통신수단' });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] bmtInfoButton[전산장비관리 바로가기].Select (L114) → MenuOpener.openTabCallback(MenuGrid.tabPanel, "1161")
  const gotoBmtInfo = () => {
    if (!openMenuByNo('1161')) message.warning('화면을 열 수 없습니다. 메뉴 권한을 확인해주세요.');
  };

  // buildGrid() L170-183
  const columnDefs = useMemo(() => [
    gb.textCenter('personName', 100, '사원명'),  // L174
    gb.textArea('messenger', 250, '메신저'),  // L175
    gb.textArea('website', 250, '웹사이트'),  // L176
    gb.text('internalIp', 120, 'IP주소'),  // L177
    gb.text('astClassTreeName', 200, 'PC명'),  // L178
    gb.textArea('spec', 400, '세부사양'),  // L179
    gb.textArea('etc', 200, '기타사항'),  // L180
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L107) → retrieve() */}
          <SearchBar
            onSearch={retrieve}
            loading={loading}
            extra={<Button type="download" onClick={downLoad}>출력/다운로드</Button>}
          >
            <SearchBar.Field label="기준일자">
              <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E1] searchText.KeyPress [Enter] (L98) → retrieve() */}
              <SearchBar.Input style={{ width: 250 }} placeholder="사원명/메신저/웹사이트/.." value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Button type="goto" onClick={gotoBmtInfo}>전산장비관리 바로가기</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BmtEmpIct> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.pcHistoryId)} />
        </div>
      </div>
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
