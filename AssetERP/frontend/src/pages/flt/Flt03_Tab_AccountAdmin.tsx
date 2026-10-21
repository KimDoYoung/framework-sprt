/**
 * 계좌신고현황 (J01) — 준법감시 > 11. 임직원매매(준감인) > 계좌신고현황 #1488
 * AS-IS: myApp/client/vi/flt/Flt03_Tab_AccountAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-73: vlc = 툴바(기준일 · 폐쇄계좌 포함 · [조회]) / 읽기 전용 그리드(체크박스 단일 선택, 헤더 묶음 "계좌개설"·"계좌폐쇄")
 * 상세보기(보기 아이콘)가 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다음 단계 (I02와 같은 1단계)
 * UX보강(10): 툴바 = SearchBar(UX-01), 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltAccountAdmin } from '@/types/flt';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';

const gb = gbFor<FltAccountAdmin>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export const Flt03_Tab_AccountAdmin: React.FC = () => {
  // settings() L75-92: 기준일 = 오늘, 폐쇄계좌 포함 = 체크
  const [baseDate, setBaseDate] = useState<Dayjs>(() => dayjs());
  const [closeYn, setCloseYn] = useState(true);
  const [rows, setRows] = useState<FltAccountAdmin[]>([]);
  const paramRef = useRef({ baseDate, closeYn });
  paramRef.current = { baseDate, closeYn };

  // retrieve() L133-148: 서비스 flt.Flt03_Account.selectByDate(companyId, personId=null, setupDate, closeAccountYn)
  const retrieve = useCallback(async () => {
    const p = paramRef.current;
    try {
      setRows(await fltApi.searchAccountsByDate(p.baseDate.format(DATE_FORMAT), p.closeYn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L50-73) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  // viewAppr() L150-172: 상신문서 보기(Apr01_Edit_ApprDoc, 다음 단계). 문서가 없으면 열람권한 없음 안내
  const viewAppr = (apprId: number | null) => {
    if (apprId == null) message.warning('해당문서의 열람권한이 없습니다');
    else message.info('전자결재 문서 창은 다음 단계에서 연결합니다.');
  };

  // buildGrid() L94-131
  const columnDefs = useMemo(() => [
    gb.text('orgName', 150, '본부(부서)'),
    gb.text('personName', 100, '사원명'),
    gb.text('corpName', 150, '개설기관'),
    gb.text('accountNoDec', 150, '계좌번호'),
    gb.textCenter('accountName', 80, '계좌명'),
    gb.textCenter('familyRelateName', 70, '관계'),
    gb.text('itemTypeName', 130, '종목유형'),
    gb.group('계좌개설', [
      gb.date('setupDate', 90, '계좌개설일'),
      gb.textCenter('apprStatusName', 80, '상신상태'),
      iconCell<FltAccountAdmin>('view', 'apprCell', 60, '보기', row => viewAppr(row.apprId)),
    ]),
    gb.group('계좌폐쇄', [
      gb.date('closeDate', 90, '계좌폐쇄일'),
      gb.textCenter('closeApprStatusName', 80, '상신상태'),
      iconCell<FltAccountAdmin>('view', 'closeApprCell', 60, '보기', row => viewAppr(row.closeApprId)),
    ]),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L86) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={baseDate} format={DATE_FORMAT} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>폐쇄계좌 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<FltAccountAdmin>
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.accountId)}
          />
        </div>
      </div>
    </div>
  );
};
