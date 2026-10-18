/**
 * 책무매뉴얼 점검항목 조회창 (E13) — Tdm42_Tab_ManlManagerAdmin 그리드의 아이콘(actionCell)에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_ManlItem.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-66: 모달 1600×800, 최대화·크기 조절 가능, 닫기 아이콘 없음. open() L68-105: 툴바(검색 · 사용여부 · [조회] · 잠금이 아니면 [등록][삭제]) + 점검항목 그리드(체크박스 단일)
 * 등록·수정·보기 창 Tdm43_Edit_Manl(+Tdm43_Page_Relate 등)은 다음 단계(E13-2)라 [등록]·점검항목 보기 아이콘은 안내만 한다
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlItem, TdmManlOrg } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SearchBar } from '@/components/search';
import { dynamicViewCell } from './tdmGridCells';

type Row = TdmManlItem & { rowKey: string };

const gb = gbFor<Row>();

interface Props {
  /** AS-IS open(param): manlOrgId·lockYn·roleName·orgName — 있으면 열린다 */
  manlOrg: TdmManlOrg | null;
  onClose: () => void;
}

export const Tdm43_Lookup_ManlItem: React.FC<Props> = ({ manlOrg, onClose }) => {
  const gridRef = useRef<AgGridReact<Row>>(null);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState('%');                     // useComboBox "UseYnCode" 전체('%')
  const [rows, setRows] = useState<Row[]>([]);
  const lockYn = !!manlOrg?.lockYn;

  // [E3] retrieveButton[조회].Select (L128) → retrieve() L178-191: 서비스 tdm.Tdm43_Manl.selectByManlOrgId(manlOrgId, useYn(code), "%검색어%")
  const retrieve = async (over?: { useYn?: string }) => {
    if (!manlOrg) return;
    try {
      const list = await tdmApi.searchManlItems(manlOrg.manlOrgId, over?.useYn ?? useYn, searchText);
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.manlId}_${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L60-66) → open() L68-105 끝: show() → retrieve()
  useEffect(() => {
    setSearchText('');
    setUseYn('%');
    setRows([]);
    if (manlOrg) void retrieve({ useYn: '%' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manlOrg?.manlOrgId]);

  // lookupManl() L193-206: 잠금이면 Tdm43_Edit_Manl.view(model), 아니면 edit(model) — Tdm43_Edit_Manl은 다음 단계(E13-2)
  const lookupManl = () => {
    message.info('점검항목 입력 창(Tdm43_Edit_Manl)은 다음 단계(E13-2)에서 변환합니다.');
  };

  // [E4] insertButton[등록].Select (L134) → insert() L208-236: 관리의무를 고르고 Tdm43_Edit_Manl.insert(…) — Tdm43_Edit_Manl은 다음 단계(E13-2)
  const insert = () => {
    if ((gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) return void message.warning('점검항목을 등록할 관리의무를 선택해주세요');
    message.info('점검항목 입력 창(Tdm43_Edit_Manl)은 다음 단계(E13-2)에서 변환합니다.');
  };

  // [E5] deleteButton[삭제].Select (L140) → delete() L238-272 → [E7] messageBox.DialogHide [YES] (L252): tdm.Tdm43_Manl.delete → 그리드에서 뺀다
  const deleteManl = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) return void message.warning('삭제할 점점항목을 선택하세요');   // 원본 문구 그대로(점점)
    const target = selected[0];
    if (target.manlCode == null) return void message.warning('선택한 관리의무는 점검항목이 등록되어 있지 않습니다');
    Modal.confirm({
      title: '확인',
      content: '선택한 점검항목을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await tdmApi.deleteManlItem(target.manlOrgId, target.manlId);
          setRows(prev => prev.filter(r => r.rowKey !== target.rowKey));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L154-176 (setChecked SINGLE)
  const columnDefs = useMemo(() => [
    gb.textArea('taskName', 250, '책무'),  // L165
    gb.textArea('taskDetailAddSeq', 300, '책무세부'),  // L166
    gb.textArea('taskDutyAddSeq', 300, '관리의무'),  // L167
    gb.textArea('checkItemAddCode', 300, '점검항목'),  // L168
    dynamicViewCell<Row>('checkItemAddCode', 'viewCell', 35, '', () => lookupManl()),  // L169 addDynamicCell(viewCell)
    gb.textArea('checkHowLimit', 350, '점검방법'),  // L170
    gb.text('checkCycleName', 60, '점검주기'),  // L171
    gb.textArea('checkEvidDocName', 150, '증빙자료'),  // L172
    gb.booleanYn2('unuseYn', 50, '미사용'),  // L173
  ], []);

  return (
    <Modal
      open={!!manlOrg}
      title={<b>{manlOrg?.roleName}-{manlOrg?.orgName} 점검항목</b>}
      width="min(1600px, calc(100vw - 32px))"
      style={{ top: 16 }}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={<div style={{ textAlign: 'center' }}>{/* [E6] closeButton[닫기].Select (L146) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ height: 'calc(100vh - 210px)', minHeight: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => retrieve()} extra={!lockYn && (
          <Space>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="delete" onClick={deleteManl}>삭제</Button>
          </Space>
        )}>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L119) → retrieve() */}
            <SearchBar.Input style={{ width: 250 }} placeholder="책무/책무세부/관리의무/점검항목" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            {/* [E1] useComboBox[UseYnCode].Collapse (L110) → retrieve() */}
            <SystemCodeComboBox kindCd="UseYnCode" altCode={['%', '전체']} style={{ width: 80 }} allowClear={false} value={useYn}
              onChange={code => { const v = code ?? '%'; setUseYn(v); void retrieve({ useYn: v }); }} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Row>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => p.data.rowKey}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }}
          />
        </div>
      </div>
    </Modal>
  );
};
