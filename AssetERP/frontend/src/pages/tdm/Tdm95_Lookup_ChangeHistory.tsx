/**
 * 변경/삭제 이력 창 (N05) — 책무 등록·책무 세부내용의 [변경이력]·행의 이력 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm95_Lookup_ChangeHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1400×700(원본) → 그대로 1400: 툴바(구분 콤보 · 검색 · [조회] · 안내 글) + 왼쪽 이력 그리드(680) + 오른쪽 상세 그리드. 특정 행의 이력(targetId)이면 구분·검색 칸이 없다
 * UX보강(10): 조회창(UX-05·06), 검색 칸 = SearchBar.Input(UX-04)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space, Typography } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmChangeDetail, TdmChangeHistory } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const histGb = gbFor<TdmChangeHistory>();
const detailGb = gbFor<TdmChangeDetail>();

interface Props {
  /** 값이 있으면 열림 — AS-IS open(targetTable, targetId) 의 targetTable */
  targetTable: string | null;
  /** 특정 행의 이력만 보려면 그 행의 ID (AS-IS open(targetTable, targetId)) */
  targetId?: number | null;
  onClose: () => void;
}

export const Tdm95_Lookup_ChangeHistory: React.FC<Props> = ({ targetTable, targetId = null, onClose }) => {
  const [dmlType, setDmlType] = useState<{ code: string; name: string }>({ code: '%', name: '전체' });
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmChangeHistory[]>([]);
  const [detailRows, setDetailRows] = useState<TdmChangeDetail[]>([]);
  const [text, setText] = useState<{ title: string; value: string | null } | null>(null);

  // buildGrid() L177-189 (setRowNumHidden(true))
  const histColumns = useMemo(() => [
    histGb.longCenter('rowNum', 50, ' '),  // L182
    histGb.textCenter('changeDateStr', 150, '처리일시'),  // L183
    histGb.textCenter('changeEmpName', 80, '처리자'),  // L184
    histGb.textCenter('changeType', 70, '처리구분'),  // L185
    histGb.text('reason', 300, '사유'),  // L186
  ], []);
  // detailBuildGrid() L191-200
  const detailColumns = useMemo(() => [
    detailGb.text('windowItemName', 150, '변경항목'),  // L195
    detailGb.text('beforeData', 250, '변경 전 데이터'),  // L196
    detailGb.text('afterData', 250, '변경 후 데이터'),  // L197
  ], []);

  // retrieve() L202-230: tdm.Tdm95_ChangeHistory.selectByTargetId (companyId는 서버, searchText 비면 null·아니면 %…%, 구분은 '전체'가 아니면 콤보 글자)
  const retrieve = async (type = dmlType, search = searchText) => {
    if (!targetTable) return;
    try {
      setRows(await tdmApi.searchChangeHistories({
        targetTable, targetId, changeType: type.code === '%' ? null : type.name, searchText: search || null,
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // detailRetrieve() L232-243: tdm.Tdm96_ChangeDetail.selectByChangeHistoryId
  const detailRetrieve = async (row: TdmChangeHistory) => {
    try {
      setDetailRows(await tdmApi.searchChangeDetails(row.changeHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L60-65) → open(targetTable, targetId) L67-105 → retrieve()
  useEffect(() => {
    if (!targetTable) return;
    const all = { code: '%', name: '전체' };
    setDmlType(all);
    setSearchText('');
    setDetailRows([]);
    void retrieve(all, '');
  }, [targetTable, targetId]);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LookupModal
      open={!!targetTable}
      title="변경/삭제 이력"
      width={1400}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] closeButton[닫기].Select (L169) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 540, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          {targetId == null && (
            <SearchBar onSearch={() => retrieve()}>
              <SearchBar.Field label="구분">
                {/* [E1] dmlTypeComboBox[DataDmlType].Collapse (L109) → retrieve() */}
                <SystemCodeComboBox
                  kindCd="DataDmlType"
                  altCode={['%', '전체']}
                  style={{ width: 100 }}
                  value={dmlType.code}
                  onChange={(code, name) => { const v = { code: code ?? '%', name: name ?? '전체' }; setDmlType(v); void retrieve(v); }}
                />
              </SearchBar.Field>
              <SearchBar.Field label="검색">
                {/* [E2] searchText.KeyPress [Enter] (L118) → retrieve() */}
                <SearchBar.Input style={{ width: 200 }} placeholder="처리자/사유/변경항목" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
          )}
          {/* [E6] retrieveButton[조회].Select (L163) → retrieve() — 특정 행의 이력일 때는 조회 버튼만 */}
          {targetId != null && <Button type="search" onClick={() => retrieve()}>조회</Button>}
          <Typography.Text type="secondary">* '사유' 및 '변경 전/후 데이터'는 더블 클릭하여 넓은 팝업으로 볼 수 있습니다</Typography.Text>
        </Space>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{ width: 680 }}>
            {/* [E3] grid.SelectionChanged [selectModel == null] (L127) → detailRetrieve(): 조회 뒤 첫 행 선택 (L225-228)
                [E4] grid.CellDoubleClick [cellIndex == 5] (L137) → 사유 칸을 NoticeMessage로 */}
            <SingleGrid<TdmChangeHistory>
              rowData={rows}
              columnDefs={histColumns}
              rowNumber={false}
              getRowId={p => String(p.data.changeHistoryId)}
              onSelect={row => { if (row) void detailRetrieve(row); }}
              onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
              onCellDoubleClicked={e => { if (e.colDef.field === 'reason') setText({ title: '사유', value: e.data?.reason ?? null }); }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E5] detailGrid.CellDoubleClick [cellIndex == 2] (L148) → 변경 전/후 데이터를 NoticeMessage로 */}
            <SingleGrid<TdmChangeDetail>
              rowData={detailRows}
              columnDefs={detailColumns}
              getRowId={p => String(p.data.changeDetailId)}
              onCellDoubleClicked={e => {
                if (e.colDef.field === 'beforeData') setText({ title: '변경 전 데이터', value: e.data?.beforeData ?? null });
                else if (e.colDef.field === 'afterData') setText({ title: '변경 후 데이터', value: e.data?.afterData ?? null });
              }}
            />
          </div>
        </div>
      </div>
      <AreaMessage open={!!text} title={text?.title ?? ''} value={text?.value} readOnly width={450} height={250} onClose={() => setText(null)} />
    </LookupModal>
  );
};
