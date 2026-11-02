/**
 * [1237] 커뮤니티 > 04. 업무보고 > 기간별 업무확인 (Z09)
 * AS-IS: myApp/client/vi/rpt/Rpt01_Tab_DailyConfirm.java (376줄) + Rpt01_Edit_DailyConfirm (127줄, 확인자 비고 창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L74-111: north = 툴바 50(조회기간 ~ · 검색 250 "본부(부서)/사원/업무내용/확인자비고" · "미확인건만 조회" 체크 · [조회][출력/다운로드] · [확인][확인취소]), center = 일일업무 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style/SGP/Chk02_Tab_DailyList.tsx, 편집 팝업 Rpt01_Edit_DailyConfirm)
 * RD: [출력/다운로드]는 `sys99_print`를 채워 `RdViewer`로 mrd Rpt01_Rd_Daily를 띄운다(docs/RD-대책.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조회 대상 = 로그인 사원 조직과 그 아래 조직(주석 처리된 본부 조회창 L65-67·L85-87·L129-136·L353-368은 옮기지 않았다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { rptDailyApi } from '@/api/rpt';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { RptDailyConfirm } from '@/types/rpt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar, useSearchParams } from '@/components/search';
import { Rpt01_Edit_DailyConfirm } from './Rpt01_Edit_DailyConfirm';

const gb = gbFor<RptDailyConfirm>();
const DATE = 'YYYY-MM-DD';

export const Rpt01_Tab_DailyConfirm: React.FC = () => {
  const gridRef = useRef<AgGridReact<RptDailyConfirm>>(null);
  const [rows, setRows] = useState<RptDailyConfirm[]>([]);
  const [editTarget, setEditTarget] = useState<RptDailyConfirm | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  // settings() L113-139: 조회기간 = 이번 달 1일 ~ 그 달 말일, 검색어 빈칸, "미확인건만 조회" 꺼짐
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('month'), closeDate: dayjs().endOf('month'), searchText: '', unconfirmedOnly: false }));
  const { startDate, closeDate, searchText, unconfirmedOnly } = sp.values;

  // retrieve() L334-351: 서비스 rpt.Rpt01_Daily.selectByConfirmText(companyId, confirmYn = 체크 값, startDate, closeDate, orgCodeId = 로그인 사원 조직(서버), "%검색어%")
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      setRows(await rptDailyApi.searchConfirm(v.startDate.format(DATE), v.closeDate.format(DATE), v.unconfirmedOnly, v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 (생성자 L74-111) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E3] downLoadButton[출력/다운로드].Select (L156) → 서비스 sys.Sys99_Print.insertRdDaily(windowClassName "Rpt01_Tab_DailyConfirm", companyId, personId, confirmYn, startDate, closeDate, orgCodeId, searchText)
  //   → 성공이면 RDViewer.viewer(dns admin · CommonViewer.html · mrd Rpt01_Rd_Daily · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    const v = sp.current.current;
    try {
      const groupId = await rptDailyApi.rdPrint(v.startDate.format(DATE), v.closeDate.format(DATE), v.unconfirmedOnly, v.searchText);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Rpt01_Rd_Daily',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: v.startDate.format(DATE), closeDate: v.closeDate.format(DATE) },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // [E4] confirmButton[확인].Select (L202) · [E5] cancleButton[확인취소].Select (L208) → updateConfirmYnChk(true|false) L247-290
  //   선택 없으면 "대상을 먼저 선택해주세요", 확인창 "n건의 항목을 확인하시겠습니까?"(제목 "확인", 폭 300) / "n건의 항목을 취소하시겠습니까?"(제목 "확인취소", 폭 300)
  //   → [E7]·[E8] msgBox.DialogHide [YES] (L256·L274) → updateConfirmYn() L292-332: 이미 확인된 건이 있으면 "이미 확인완료된 업무가 있습니다.", 확인 전 건이 있으면 "확인전인 업무가 있습니다."
  //   → 서비스 rpt.Rpt01_Daily.confirmUpdate → 성공하면 retrieve()
  const updateConfirmYnChk = (confirmYn: boolean) => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('대상을 먼저 선택해주세요'); return; }
    Modal.confirm({
      title: confirmYn ? '확인' : '확인취소',
      content: `${checked.length}건의 항목을 ${confirmYn ? '확인' : '취소'}하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        if (confirmYn && checked.some(r => r.confirmYn === true)) { message.warning('이미 확인완료된 업무가 있습니다.'); return; }
        if (!confirmYn && checked.some(r => r.confirmYn !== true)) { message.warning('확인전인 업무가 있습니다.'); return; }
        try {
          await rptDailyApi.confirm(checked.map(r => r.dailyId), confirmYn);
        } catch (err) {
          message.error(errorMessage(err, confirmYn ? '확인 실패' : '확인취소 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L216-245
  const columnDefs = useMemo(() => [
    gb.textCenter('personOrg', 100, '본부(부서)'),  // L236
    gb.textCenter('personName', 100, '사원'),  // L237
    gb.date('date', 100, '일자'),  // L238
    gb.textArea('content', 600, '업무내용'),  // L239 addTextLimitArea
    gb.textArea('confirmNote', 300, '확인자 비고'),  // L240 addTextLimitArea
    // [E6] editCell (ImageCell "Edit").callbackOnCreate (L223) → Rpt01_Edit_DailyConfirm.edit(선택 행, callback → retrieve())
    iconCell<RptDailyConfirm>('edit', 'actionCell', 30, ' ', row => setEditTarget(row)),  // L241
    gb.textCenter('confirmYnName', 100, '확인여부'),  // L242
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L149) → retrieve(), [E1] searchText.KeyPress [Enter] (L141) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="download" onClick={downLoad}>출력/다운로드</Button>
            <Button type="save" onClick={() => updateConfirmYnChk(true)}>확인</Button>
            <Button type="cancel" onClick={() => updateConfirmYnChk(false)}>확인취소</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="본부(부서)/사원/업무내용/확인자비고" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <Checkbox checked={unconfirmedOnly} onChange={e => sp.set('unconfirmedOnly', e.target.checked)}>미확인건만 조회</Checkbox>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<RptDailyConfirm>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.dailyId)}
        />
      </div>
      <Rpt01_Edit_DailyConfirm model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
      <RdViewer url={rdUrl} title="기간별 업무확인" onClose={() => setRdUrl(null)} />
    </div>
  );
};
