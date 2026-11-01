/**
 * [1221] 신청 > 80. 사업비 신청 > 복리후생비 신청 (Y06)
 * AS-IS: myApp/client/vi/emp/Emp17_Tab_Benefit.java (342줄) + Emp17_Lookup_Benefit.java (490줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L78-124: 가운데(여백 20, 테두리) = 툴바(조회기간 100 ~ 100 · 신청구분 콤보("전체" 포함) · 지급여부 100 (전체·지급완료·미지급) · 검색 230 "문서명" · [조회][등록][삭제] ·
 *   [문서분류지정](관리자만)) + 본인 신청 그리드(SingleGrid, 행번호·체크 단일, 10열 + 문서보기 아이콘).
 * 등록 = Emp17_Lookup_Benefit(신청 창 → 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A21~A23·A37·A49), 문서보기 = Apr01_Edit_ApprDoc.retrieveApproval.
 * 스타일: SG (견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 툴바-그리드 간격 8)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empBenefitApi } from '@/api/emp';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Benefit, BenefitType } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Emp17_Lookup_Benefit } from './Emp17_Lookup_Benefit';

const gb = gbFor<BenefitRow>();
const FORMAT = 'YYYY-MM-DD';
const ALL_TYPE: BenefitType = { code: '%', name: '전체' };
const YN_OPTIONS = ['전체', '지급완료', '미지급'];  // benefitYn.getStore().add(...) L106-108

/** 그리드 행: 지급여부 글자(Emp17_BenefitModel.getBenefitYnStr — 지급완료가 아니면 미지급) */
type BenefitRow = Benefit & { benefitYnStr: string };
const toRow = (b: Benefit): BenefitRow => ({ ...b, benefitYnStr: b.benefitYn === 'true' ? '지급완료' : '미지급' });

export const Emp17_Tab_Benefit: React.FC = () => {
  // settings() L126-189: 조회기간 = 올해 1월 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [benefitCode, setBenefitCode] = useState('%');
  const [benefitYnName, setBenefitYnName] = useState('전체');
  const [searchText, setSearchText] = useState('');
  const [types, setTypes] = useState<BenefitType[]>([]);
  const [rows, setRows] = useState<BenefitRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [userManager, setUserManager] = useState(false);  // LoginUser.getIsUserManager() || getIsManager() L101
  const gridRef = useRef<AgGridReact<BenefitRow> | null>(null);

  // retrieve() L255-289: emp.Emp17_Benefit.selectByPersonId (benefitCode "%" · benefitYn "true"/"false"/"%" · searchText "%글자%")
  const retrieve = useCallback(async (next?: { code?: string; yn?: string }) => {
    const yn = next?.yn ?? benefitYnName;
    setLoading(true);
    try {
      const list = await empBenefitApi.searchMine({
        startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT),
        benefitCode: next?.code ?? benefitCode,
        benefitYn: yn === '지급완료' ? 'true' : yn === '미지급' ? 'false' : undefined,
        searchText,
      });
      setRows(list.map(toRow));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [benefitCode, benefitYnName, closeDate, searchText, startDate]);

  // [E0] 화면 열림 (생성자 L78-124) → settings(), retrieve() / 신청구분 콤보 조회 L75-76
  useEffect(() => {
    empBenefitApi.searchBenefitTypes().then(setTypes).catch(err => message.error(errorMessage(err, '조회 실패')));
    schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false));
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] deleteButton[삭제].Select (L149) → deleteRow() L291-314: 결재상태가 없음·반려(40)·임시저장(99)이면 확인 후 emp.Emp17_Benefit.delete, 아니면 안내
  const deleteRow = () => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) { message.warning('삭제할 항목을 선택해주세요'); return; }  // 원본은 선택 없이 누르면 오류 — 안내만 더한다
    if (sel.apprStatusCode == null || sel.apprStatusCode === '40' || sel.apprStatusCode === '99') {
      Modal.confirm({
        title: '삭제',
        content: '1건의 정보를 삭제하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 450,
        // [E9] messageBox.DialogHide [YES] (L297) → emp.Emp17_Benefit.delete
        onOk: async () => {
          try {
            await empBenefitApi.deleteBenefit(sel.benefitId);
            setRows(prev => prev.filter(r => r.benefitId !== sel.benefitId));
          } catch (err) {
            message.error(errorMessage(err, '삭제 실패'));
          }
        },
      });
    } else {
      message.warning('결재 중인 문서가 존재하여 삭제할 수 없습니다.');
    }
  };

  // [E8] actionCell (ImageCell View).callbackOnCreate (L222) → 상신ID가 있으면 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval, 없으면 안내
  const viewAppr = (row: BenefitRow) => {
    gridRef.current?.api?.getRowNode(String(row.benefitId))?.setSelected(true, true);
    if (row.apprId != null) setViewApprId(row.apprId);
    else message.warning('상신문서가 존재하지 않습니다');
  };

  // buildGrid() L191-250
  const columnDefs = useMemo(() => [
    gb.date('issueDate', 100, '신청일'),  // L2
    gb.text('benefitName', 150, '신청구분'),
    gb.text('apprTitleName', 400, '문서명'),
    gb.long('issueAmt', 150, '신청금액'),
    gb.date('occDate', 100, '발생일자'),
    gb.text('benefitDetail', 160, '내용'),
    gb.textCenter('apprStatusName', 100, '결재상태'),
    iconCell<BenefitRow>('view', 'actionCell', 80, '문서보기', viewAppr),
    gb.textCenter('benefitYnStr', 100, '지급여부'),
    gb.textArea('note', 350, '알림'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L137) → retrieve(), [E4] searchTextField.KeyPress [Enter] (L156) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={
            <>
              {/* [E2] insertButton[등록].Select (L143) → insertBenefit() L316-324: Emp17_Lookup_Benefit.insert(→ retrieve()) */}
              <Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
              {/* [E7] dcrLinkButton[문서분류지정].Select (L177) → Dcr30_Lookup_Link.open("LinkCode0001", …) */}
              {userManager && <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>}
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
              ~
              <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="신청구분">
            {/* [E5] benefitTypeName[sys.Sys00_Common.selectBenefit].Collapse (L165) → retrieve() */}
            <Select style={{ width: 120 }} value={benefitCode} options={[ALL_TYPE, ...types].map(t => ({ value: t.code, label: t.name }))}
              onChange={v => { setBenefitCode(v); void retrieve({ code: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="지급여부">
            {/* [E6] benefitYn[전체].Collapse (L171) → retrieve() */}
            <Select style={{ width: 100 }} value={benefitYnName} options={YN_OPTIONS.map(n => ({ value: n, label: n }))}
              onChange={v => { setBenefitYnName(v); void retrieve({ yn: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 230 }} placeholder="문서명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BenefitRow> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.benefitId)} />
        </div>
      </div>
      <Emp17_Lookup_Benefit open={insertOpen} onSaved={() => void retrieve()} onClose={() => setInsertOpen(false)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0001" onClose={() => setLinkOpen(false)} />
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClosed={() => void retrieve()} onClose={() => setViewApprId(null)} />
    </div>
  );
};
