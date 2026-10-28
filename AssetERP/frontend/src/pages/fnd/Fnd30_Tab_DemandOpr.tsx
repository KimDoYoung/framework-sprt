/**
 * [1341] 펀드관리 > 04. 공모주청약 > 공모주 수요예측 (Q05)
 * AS-IS: myApp/client/vi/fnd/Fnd30_Tab_DemandOpr.java (494줄) + Fnd31_Page_DemandOprFund.java (286줄, 아래 펀드별 신청 목록) + Fnd31_Edit_DemandOprFund.java (358줄) + Fnd30_Edit_DemandOpr.java (332줄) + components/lookup/Adv02_Lookup_SelectSingle — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L73-120: BorderLayout 가운데(여백 20, 테두리) = 툴바 50(신청일 [시작 100 ~ 종료 100] · 검색 250 "종목/주간사" · [조회][등록][삭제] · [문서분류지정]) + 수요예측 그리드(체크 단일) / 아래 400(여백 0·20·20·20, 테두리) = Fnd31_Page_DemandOprFund
 * UX보강(10): 툴바 = SearchBar(UX-01). 초기화(UX-02)는 원본에 없어 넣지 않는다
 * [다음 단계] 전자결재 편집창 Apr01_Edit_ApprDoc([결재요청]이 문서분류 조회창 Dcr01_Lookup_Class를 거쳐 여는 insertLinkApproval·[상세보기]의 retrieveApproval, 끝난 뒤 updateApprId)과
 *   문서분류지정 창 Dcr30_Lookup_Link는 B15에서 연결했다(열 때 defaultName은 다음 단계). 결재요청은 편집창이 열릴 자리까지의 사전 검사·확인 창을 원본 그대로 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OprDemand } from '@/types/fnd';
import { Button } from '@/components/button';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { AgGridReact } from 'ag-grid-react';
import { DemandOprTarget, Fnd30_Edit_DemandOpr } from './Fnd30_Edit_DemandOpr';
import { Fnd31_Page_DemandOprFund } from './Fnd31_Page_DemandOprFund';

const gb = gbFor<OprDemand>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE): 체크박스 단일 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
const inAppr = (status?: string | null) => status === '10' || status === '20' || status === '30';

export const Fnd30_Tab_DemandOpr: React.FC = () => {
  const [linkOpen, setLinkOpen] = useState(false);
  const gridRef = useRef<AgGridReact<OprDemand>>(null);
  // settings() L122-170: 신청일 올해 1/1 ~ 오늘, 검색칸 250 "종목/주간사"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<OprDemand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOprId, setSelectedOprId] = useState<number | null>(null);
  const [target, setTarget] = useState<DemandOprTarget | null>(null);

  // retrieve() L393-408: fnd.Fnd30_Opr.selectByDemandDate(oprCode "02"). 조회가 끝나면 첫 행을 선택한다(grid.getSelectionModel().select(0, false))
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fndApi.searchDemandOprs({ startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), searchText });
      setRows(list);
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [startDate, closeDate, searchText]);

  // [E0] 화면 열림 (생성자 L73-120) → settings(), defaultName(다음 단계), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E1] grid.SelectionChanged (L111) → retrieveEtcPerson() L385-391: 고른 행이 있을 때만 아래 목록을 그 수요예측으로 바꾼다
  const retrieveEtcPerson = () => {
    const selected = gridRef.current?.api?.getSelectedRows()[0];
    if (selected) setSelectedOprId(selected.oprId);
  };

  // [E5] deleteButton[삭제].Select (L152) → deleteCheck() L410-447: 고른 행이 없으면 안내, 결재완료(30)·진행(10·20)이면 막고, 아니면 확인(300폭) → [E11] YES → delete() L449-479
  const deleteCheck = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    for (const row of selected) {
      if (row.apprStatusCode === '30') { message.warning('결재완료된 문서가 존재합니다'); return; }
      if (row.apprStatusCode === '10' || row.apprStatusCode === '20') { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 정보를 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await fndApi.deleteOpr(selected[0].oprId);  // deleteApprId → deleteOprFund → delete (서버가 한 번에)
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E7]·[E8] editCell (ImageCell) (L201·L208): 결재상태가 10·20·30이면 edit2(읽기 전용), 아니면 edit. 저장하면 retrieve()
  const editRow = (row: OprDemand) => setTarget({ mode: inAppr(row.apprStatusCode) ? 'edit2' : 'edit', row });

  // [E9] actionCell [결재요청] (L218-272): apr.Apr01_Appr.selectById — 문서가 없으면 바로, 결재진행 중(10·20)이면 막고, 99(반려)·그 밖은 확인 뒤 insertApproval(lastApprId)
  const requestAppr = async (row: OprDemand) => {
    let status: string | null | undefined = null;
    if (row.apprId != null) {
      try {
        status = (await fndApi.getOpr(row.oprId)).apprStatusCode;
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        return;
      }
    }
    const proceed = () => message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');  // insertApproval() L330-348 → insertLinkApproval() L350 → updateApprId() L365
    if (status == null) { proceed(); return; }
    if (status === '10' || status === '20') { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: status === '99' ? '확인시 문서가 새로 작성됩니다. 진행하시겠습니까?' : '문서상신이 완료된 경우 재상신합니다. 진행하시겠습니까?',
      width: 550,
      okText: '예',
      cancelText: '아니오',
      onOk: proceed,
    });
  };

  // [E10] viewCell [상세보기] (L275-305): 문서가 없으면 안내, 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
  const viewAppr = (row: OprDemand) => {
    if (row.apprId == null) { message.warning('해당 문서가 없습니다. 결재상태를 확인해주세요.'); return; }
    message.info('전자결재 편집창(Apr01_Edit_ApprDoc)은 다음 단계에서 연결합니다.');
  };

  // buildGrid() L191-328
  const columnDefs = useMemo(() => [
    gb.date('demandDate', 90, '신청일'),
    gb.text('itemName', 200, '종목명'),
    gb.textCenter('market', 80, '시장구분'),
    gb.text('leadManager', 180, '주간사'),
    gb.textCenter('demandPeriod', 140, '수요예측기간'),
    gb.textCenter('priceBracket', 140, '공모가밴드'),
    gb.long('price', 80, '신청가격'),
    gb.textHtml('priceAcceptStr', 100, '확정공모가액<br>-10% 변동수용', { cellStyle: { textAlign: 'center' } }),  // addTextCenterHtml
    gb.textCenter('lockPeriod', 75, '확약기간'),
    iconCell<OprDemand>('edit', 'editAction', 40, '수정', editRow),
    iconCell<OprDemand>('edit', 'apprAction', 60, '결재요청', row => void requestAppr(row)),
    gb.textCenter('apprStatusName', 70, '결재상태'),
    iconCell<OprDemand>('view', 'viewAction', 60, '상세보기', viewAppr),
    gb.textCenter('cancelName', 60, '참여취소'),
    gb.text('note', 400, '비고'),
  ], []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ flex: 1, minHeight: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, background: '#fff' }}>
        {/* [E3] retrieveButton[조회].Select (L140) → retrieve(), [E2] searchText.KeyPress [Enter] (L131) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={loading}
          extra={<>
            {/* [E4] insertButton[등록].Select (L146) → insertRow() L481-489: Fnd30_Edit_DemandOpr.insert(callback → retrieve()) */}
            <Button type="register" onClick={() => setTarget({ mode: 'insert' })}>등록</Button>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
            {/* [E6] dcrLinkButton[문서분류지정].Select (L158) → Dcr30_Lookup_Link.open("A38", callback → defaultName()) (B15; defaultName은 아직 다음 단계라 callback은 비워 둔다) */}
            <Button type="select" onClick={() => setLinkOpen(true)}>문서분류지정</Button>
          </>}
        >
          <SearchBar.Field label="신청일">
            <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
            <span> ~ </span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="종목/주간사" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<OprDemand>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.oprId)}
            rowSelection={SINGLE_CHECK}
            onSelectionChanged={retrieveEtcPerson}
          />
        </div>
      </div>
      <div style={{ height: 400, flex: 'none', border: '1px solid #d9d9d9', boxSizing: 'border-box', background: '#fff' }}>
        <Fnd31_Page_DemandOprFund oprId={selectedOprId} />
      </div>
      <Fnd30_Edit_DemandOpr target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="A38" onClose={() => setLinkOpen(false)} />
    </div>
  );
};
