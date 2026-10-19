/**
 * 문서작성 > 02. 문서검색 > 폐기문서 승인 (F10, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr90_Tab_DisposalAppr.java (261줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: vlc = 툴바(조회기간 [시작] ~ [끝] · 처리상태 [콤보] · [조회][승인][반려]) / 폐기문서 그리드(체크박스 다중, 행번호 표시)
 * 1단계(F01~F04와 같은 사유): 상세보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDisposalAppr } from '@/types/apr';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gb = gbFor<AprDisposalAppr>();
const DATE_FORMAT = 'YYYY-MM-DD';
const ALL_CODE: [string, string] = ['%', '전체'];

export const Apr90_Tab_DisposalAppr: React.FC = () => {
  // [E0] 화면 열림 (생성자 L59-86) → settings() L88-116: 시작일 = 올해 1월 1일, 종료일 = 오늘(LoginUser.getToday()), 처리상태 = 전체 → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [disposalCode, setDisposalCode] = useState<string>('%');
  const [rows, setRows] = useState<AprDisposalAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<AprDisposalAppr>>(null);
  const seq = useRef(0);

  // [E1] retrieveButton[조회].Select (L98) → retrieve() L231-256: apr.Apr90_DisposalList.selectByCompanyId (companyId·confirmEmpId는 서버가 세션에서)
  // [E1 생략] 시작일·종료일 null 검사("조회조건의 시작일은 필수값입니다" 등) — 날짜 칸이 지우기 불가라 비는 경우가 없다
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchDisposalAppr({
        startDate: startDate.format(DATE_FORMAT),
        closeDate: closeDate.format(DATE_FORMAT),
        disposalCode,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E2] disposalButton[승인].Select (L104) → update("20") / [E3] returnButton[반려].Select (L110) → update("99")  update() L170-229
  // [E4] msgBox.DialogHide [YES] (L195) → apr.Apr90_DisposalList.updateAppr → retrieve()
  const update = (actionCode: '20' | '99') => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('선택된 문서가 존재하지 않습니다');
      return;
    }
    let msg = '폐기승인';
    if (actionCode === '99') {
      msg = '반려';
      if (selected.some(r => r.disposalCode === '20')) {
        message.warning('선택한 문서 중 폐기처리가 완료된 문서가 포함되어있습니다');
        return;
      }
    }
    Modal.confirm({
      title: '확인',
      content: `${selected.length}건의 문서를 '${msg}' 하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: async () => {
        try {
          await aprApi.updateDisposalCode(actionCode, selected.map(r => r.disposalListId));
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // buildGrid() L118-168
  const columnDefs = useMemo(() => [
    gb.textCenter('disposalName', 100, '처리상태'),  // L156
    gb.date('regDate', 100, '신청일'),  // L157
    gb.textCenter('regEmpName', 100, '신청자'),  // L158
    gb.text('title', 350, '문서명'),  // L159
    // L160 actionCell(Detail): apr.Apr01_Appr.selectById → 0건이면 "해당 문서는 폐기된 문서입니다." / 있으면 Apr01_Edit_ApprDoc.retrieveApproval(model, false)
    // [L160 생략] 문서 조회·편집창은 다음 단계
    iconCell<AprDisposalAppr>('view', 'actionCell', 45, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.textCenter('statusName', 100, '문서상태'),  // L161
    gb.textArea('reason', 400, '사유'),  // L162
    gb.booleanYn('confirmYn', 100, '승인여부'),  // L163
    gb.textCenter('confirmEmpName', 100, '승인(반려)자'),  // L164
    gb.date('confirmDate', 100, '승인(반려)일'),  // L165
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <SearchBar
        onSearch={() => void retrieve()}
        searchText="조회"
        loading={loading}
        extra={<>
          <Button type="save" onClick={() => update('20')}>승인</Button>
          <Button type="cancel" onClick={() => update('99')}>반려</Button>
        </>}
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="처리상태">
          <SystemCodeComboBox kindCd="DisposalCode" altCode={ALL_CODE} style={{ width: 120 }} value={disposalCode}
            onChange={c => setDisposalCode(c ?? '%')} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<AprDisposalAppr>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.disposalListId)}
          loading={loading}
        />
      </div>
    </div>
  );
};
