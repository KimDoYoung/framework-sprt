/**
 * 임원정보 관리 (S03) — 경영관리 > 01. 조직 및 사원관리 > 임원정보 관리 #1294
 * AS-IS: myApp/client/vi/emp/Emp31_Tab_Director.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L71-107: 툴바(검색 250 · 해임임원 포함 · [조회] · [저장] · [문서분류지정] · [임원 선임/해임 보고]) + 임원 셀 편집 그리드(행번호, 체크박스 다중 고정, 성명 고정, 우선주·보통주는 2단 헤더 "주식 보유수").
 * 행 추가·삭제 버튼은 없다(서버 delete 서비스가 있으나 화면에서 부르지 않음). 임원 대상은 서버 SQL이 정한다.
 * 1단계: 보고서 창 RDViewer.openEmp31의 선임/해임 콤보·[결재상신](다른 도메인 apr)은 다음 단계. [문서분류지정]의 Dcr30_Lookup_Link는 B15에서 연결.
 *   [임원 선임/해임 보고]는 두 출력 자료(insertRdDirector01·02)를 채우고 "선임" 보고서(Emp31_Rd_Director)를 연다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, message } from 'antd';
import { empDirectorApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { Director } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';

const gb = gbFor<Director>();

// buildGrid L159-186 — CellEditGrid(Emp31_DirectorModel), 체크박스 다중 고정
const columnDefs = [
  gb.textCenter('personName', 80, '성명', { pinned: 'left' }),
  gb.textCenter('chnName', 80, '한자명'),
  gb.textCenter('posName', 100, '직위'),
  // addOfficerYn: true→"등기", false→"비등기"
  gb.textCenter('officerYn', 70, '등기여부', { valueFormatter: p => (p.value === 'true' ? '등기' : '비등기') }),
  gb.textCenter('ctzNo', 80, '주민번호<br>(앞6자리)'),
  gb.date('initAssignDate', 100, '최초선임일', { editor: 'date' }),
  gb.date('rcntAssingDate', 100, '최근선임일', { editor: 'date' }),
  gb.date('expireDate', 100, '임기만료일', { editor: 'date' }),
  gb.longCenter('assignCnt', 70, '선임횟수', { editor: 'number' }),
  gb.textArea('addTitle', 250, '겸직사항', { editor: 'largeText' }),
  gb.textArea('qualified', 250, '자격요건확인', { editor: 'largeText' }),
  // addHeaderGroupMap: 2단 헤더 "주식 보유수" (우선주·보통주)
  gb.group('주식 보유수', [
    gb.long('preferStock', 80, '우선주', { editor: 'number' }),
    gb.long('commonStock', 80, '보통주', { editor: 'number' }),
  ]),
  gb.date('endDate', 100, '해(사)임일', { editor: 'date' }),
  gb.textArea('endReason', 250, '해(사)임 사유', { editor: 'largeText' }),
  gb.textArea('note', 200, '비고', { editor: 'largeText' }),
];

export const Emp31_Tab_Director: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [endCheck, setEndCheck] = useState(false);  // settings L110: 해임임원 포함 = false
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  const crud = useGridCrud<Director>({
    idField: 'personId',
    // retrieve() L189-201: 서비스 emp.Emp31_Director.selectByText(companyId, searchText = '%…%', endCheck)
    search: useCallback(() => empDirectorApi.searchDirectors(searchText, endCheck), [searchText, endCheck]),
    // update() L204-230: 서비스 emp.Emp31_Director.updateList(바뀐 행) → 끝나면 retrieve()
    save: useCallback(async (rows: Director[]) => { await empDirectorApi.updateDirectors(rows); return rows; }, []),
    remove: useCallback(async () => 0, []),  // 삭제 버튼이 없다(deleteRow L240-244는 화면에서 부르지 않음)
    newRow: useCallback(() => ({}), []),       // 행 추가 버튼이 없다
    reloadAfterSave: true,
  });

  // [E4] dcrLinkButton[문서분류지정].Select (L135) → Dcr30_Lookup_Link.open("LinkCode0005", callback{}) (B15)
  const [linkOpen, setLinkOpen] = useState(false);

  // [E5] rdButton[임원 선임/해임 보고].Select (L147) → 고른 행이 없으면 "선임(해임)보고 대상을 선택해주세요" → createPrint() L246-315
  const createPrint = async () => {
    const selected = (crud.gridRef.current?.api.getSelectedRows() ?? []) as Director[];
    if (selected.length === 0) {
      message.warning('선임(해임)보고 대상을 선택해주세요');
      return;
    }
    for (const row of selected) {
      if (!row.rcntAssingDate) { message.warning(`${row.personName}님의 최근선임일을 입력해주세요.`); return; }
      if (!row.expireDate) { message.warning(`${row.personName}님의 임기만료일을 입력해주세요.`); return; }
    }
    try {
      // insertRdDirector01(고른 임원, windowClassName Emp31_Tab_Director01) → insertRdDirector02(전체 현황, Emp31_Tab_Director02, endCheck false)
      const seniorGroupId = await empDirectorApi.rdPrintSenior(searchText, selected.map(r => r.personId));
      const totalGroupId = await empDirectorApi.rdPrintTotal(searchText);
      // RDViewer.openEmp31(mrd Emp31_Rd_Director · options "/rhtmlimportopt [2]" · rv seniorGroupId·totalGroupId·companyId·personId) — 선임 보고서
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp31_Rd_Director',
        options: '/rhtmlimportopt [2]',
        rv: { seniorGroupId, totalGroupId },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L71-107) → settings(), retrieve()
  useEffect(() => { void crud.retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchTextField.KeyPress [Enter] (L115) → retrieve() · [E2] retrieveButton[조회].Select (L123) → retrieve() */}
        <SearchBar
          onSearch={crud.retrieve}
          loading={crud.loading}
          extra={<>
            {/* [E3] updateButton[저장].Select (L129) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="select" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
            <Button type="download" onClick={createPrint}>임원 선임/해임 보고</Button>
          </>}
        >
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="성명/직위/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Checkbox checked={endCheck} onChange={e => setEndCheck(e.target.checked)}>해임임원 포함</Checkbox>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}><CellEditGrid<Director> crud={crud} columnDefs={columnDefs} /></div>
      </div>
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0005" onClose={() => setLinkOpen(false)} />
      <RdViewer url={rdUrl} title="임원 선임/해임 보고" onClose={() => setRdUrl(null)} />
    </div>
  );
};
