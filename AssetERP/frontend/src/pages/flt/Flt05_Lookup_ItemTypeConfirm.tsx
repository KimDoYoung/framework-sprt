/**
 * 코드설정 창 (I05) — Flt10_Tab_RealTransaction의 [종목유형코드]에서 연다. 종목유형 코드와 구분 코드를 눌러 복사해 가는 안내 창(엑셀 업로드용).
 * AS-IS: myApp/client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L54-93: 360×550, 검색 "종목유형명" + [조회] / 안내 / 종목유형 그리드, [닫기]
 * openGroup(floorTrGroupCode) L95-142: 720×550, 검색 "종목유형명 및 구분명", 종목유형 그리드(종목유형코드 90 · 종목유형명 250) | 구분 그리드(구분코드 80 · 구분명 250)
 * UX보강(10): 조회창 UX-05, 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { fltApi } from '@/api/flt';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { FltItemType } from '@/types/flt';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gbType = gbFor<FltItemType>();
const gbCode = gbFor<Code>();

/** buildGrid() L197-206 — 행번호 숨김 */
const typeColumns = [
  gbType.textCenter('itemTypeCode', 90, '종목유형코드'),
  gbType.text('itemTypeName', 250, '종목유형명'),
];
/** trTypebuildGrid() L208-217 — 행번호 숨김 */
const trTypeColumns = [
  gbCode.textCenter('code', 80, '구분코드'),
  gbCode.text('name', 250, '구분명'),
];

const NOTICE_DEFAULT = '※ 더블클릭시 코드 복사';

interface Props {
  open: boolean;
  /** openGroup(floorTrGroupCode)의 구분 코드 그룹(FloorTrCode0001·0004). 없으면 open() — 종목유형만 */
  groupCode?: string | null;
  onClose: () => void;
}

export const Flt05_Lookup_ItemTypeConfirm: React.FC<Props> = ({ open, groupCode, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [types, setTypes] = useState<FltItemType[]>([]);
  const [trTypes, setTrTypes] = useState<Code[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // retrieve() L219-234: 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText "%…%") → openGroup이면 retrieveTrType()
  // retrieveTrType() L236-249: 서비스 sys.Sys09_Code.selectByKindGroupCode(companyId, applyDate=오늘, kindGroupCode)
  const retrieve = useCallback(async (text: string) => {
    try {
      setTypes(await fltApi.searchItemTypes(text));
      if (groupCode) setTrTypes(await sysApi.searchCodesByKindGroup(groupCode));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [groupCode]);

  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setTypes([]);
    setTrTypes([]);
    setCopied(null);
    void retrieve('');
  }, [open, retrieve]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // [E4] grid.CellDoubleClick (L165)·[E5] trTypeGrid.CellDoubleClick (L180) → getCellValue(코드), copyToClipboard, showCopyNotice() L281-301 (1초 뒤 안내 원래대로)
  const copyCode = (code: string | null | undefined) => {
    if (!code) return;
    void navigator.clipboard?.writeText(code);
    setCopied(code);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1000);
  };

  return (
    <LookupModal
      open={open}
      title="코드설정"
      width={groupCode ? 780 : 420}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] cancelButton[닫기].Select (L159) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 410, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L153) → retrieve(). [E1] searchText.KeyPress [Enter] (L145) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: groupCode ? 200 : 150 }} placeholder={groupCode ? '종목유형명 및 구분명' : '종목유형명'}
              value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ fontSize: 12, fontWeight: 'bold' }}>
          <span style={{ color: '#000000' }}>&nbsp;{NOTICE_DEFAULT}</span>
          {copied && <span style={{ color: '#0000FF' }}>&nbsp;(복사완료 : {copied})</span>}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SingleGrid<FltItemType>
              rowNumber={false}
              rowData={types}
              columnDefs={typeColumns}
              getRowId={p => String(p.data.itemTypeId)}
              onRowDoubleClicked={e => copyCode(e.data?.itemTypeCode)}
            />
          </div>
          {groupCode && (
            <div style={{ flex: 1, minWidth: 0, marginLeft: -1 }}>
              <SingleGrid<Code>
                rowNumber={false}
                rowData={trTypes}
                columnDefs={trTypeColumns}
                getRowId={p => p.data.code}
                onRowDoubleClicked={e => copyCode(e.data?.code)}
              />
            </div>
          )}
        </div>
      </div>
    </LookupModal>
  );
};
