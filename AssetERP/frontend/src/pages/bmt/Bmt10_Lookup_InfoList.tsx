/**
 * 전산장비 조회창 (W18) — Bmt12_Edit_PcHistory의 [장비명] 칸이 연다 (Bmt10_Info 목록에서 장비 하나를 고른다)
 * AS-IS: myApp/client/vi/bmt/Bmt10_Lookup_InfoList.java (197줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-83: 모달 1200×600 "전산장비", 위 툴바 45(기준일자 · 구분 콤보 · ☐폐기건 포함 · [조회]) + 단일 체크 그리드, 아래 가운데 [확인][취소]
 * 03 원칙 21: 열 폭 합계 1270 → AS-IS 1200보다 작게 하지 않고, 1120이 넘어 가로 스크롤을 허용한다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, message, Space } from 'antd';
import dayjs from 'dayjs';
import { bmtInfoApi } from '@/api/bmt';
import { errorMessage } from '@/api/client';
import { BmtInfo } from '@/types/bmt';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { BmtItemClassCombo } from './bmtItemClassCombo';

const gb = gbFor<BmtInfo>();
const DATE = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 체크 단일 선택, 행 아무 곳이나 눌러도 고른다(UX-06). 렌더마다 새 객체를 주면 선택이 풀리므로 상수 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** callback.execute(result): [확인]·더블클릭 = 고른 장비(고른 게 없으면 null — 원본 그대로), [취소] = null. 닫는 것은 이 창이 스스로 한다 */
  onResult: (row: BmtInfo | null) => void;
  onClose: () => void;
}

export const Bmt10_Lookup_InfoList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [rows, setRows] = useState<BmtInfo[]>([]);
  const [selected, setSelected] = useState<BmtInfo | null>(null);
  const [baseDate, setBaseDate] = useState(() => dayjs());       // settings() L92-145: 오늘
  const [itemClass, setItemClass] = useState<string | undefined>(undefined);
  const [checkYn, setCheckYn] = useState(false);                 // 원본은 이 창에서 체크를 켜지 않는다(Bmt10_Tab_Info와 다름)
  const [loading, setLoading] = useState(false);

  // retrieve() L162-184: bmt.Bmt10_Info.selectByCompanyId(companyId, itemClassCode, baseDate, checkYn) — searchText는 보내지 않는다(이상한점 #136)
  const retrieve = useCallback(async (over?: { itemClass?: string }) => {
    setLoading(true);
    try {
      setRows(await bmtInfoApi.search({ itemClassCode: over && 'itemClass' in over ? over.itemClass : itemClass, baseDate: baseDate.format(DATE), checkYn }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [itemClass, baseDate, checkYn]);

  // [E0] 화면 열림 (생성자 L54-83, open L85-90) → settings(), retrieve()
  useEffect(() => {
    if (!open) return;
    setBaseDate(dayjs());
    setItemClass(undefined);
    setCheckYn(false);
    setSelected(null);
    setRows([]);
    setLoading(true);
    bmtInfoApi.search({ itemClassCode: undefined, baseDate: dayjs().format(DATE), checkYn: false })
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setLoading(false));
  }, [open]);

  // [E3] okButton[확인].Select (L124) → callback.execute(grid.getSelectionModel().getSelectedItem()), hide()
  const ok = (row: BmtInfo | null) => { onResult(row); onClose(); };

  // buildGrid() — 단일 체크 + 종목명·담당자·매입일자·폐기일자·취득금액·취득정보·세부사양·비고
  const columnDefs = useMemo(() => [
    gb.text('astClassTreeName', 150, '종목명'),
    gb.textCenter('personName', 80, '담당자'),
    gb.date('applyDate', 90, '매입일자'),
    gb.date('retireDate', 90, '폐기일자'),
    gb.long('acqAmount', 100, '취득금액'),
    gb.textArea('acqInfo', 200, '취득정보'),
    gb.textArea('spec', 250, '세부사양'),
    gb.textArea('note', 250, '비고'),
  ], []);

  return (
    <LookupModal open={open} title="전산장비" width={1200} style={{ top: 20 }} maskClosable={false} onCancel={() => ok(null)} destroyOnHidden focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => ok(selected)}>확인</Button>
            {/* [E4] closeButton[취소].Select (L131) → callback(null), hide() */}
            <Button type="close" onClick={() => ok(null)}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L118) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={baseDate} onChange={d => d && setBaseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E1] itemClassName[sys.Sys00_Common.selectByKindCode].Collapse (L111) → retrieve() */}
            <BmtItemClassCombo value={itemClass} onChange={code => { setItemClass(code); void retrieve({ itemClass: code }); }} />
          </SearchBar.Field>
          <Checkbox checked={checkYn} onChange={e => setCheckYn(e.target.checked)}>폐기건 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BmtInfo>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.infoId)}
            rowSelection={SINGLE_CHECK}
            onSelectionChanged={e => setSelected(e.api.getSelectedRows()[0] ?? null)}
            // [E5] grid.CellDoubleClick (L138) → callback.execute(grid.getSelectionModel().getSelectedItem()), hide()
            onRowDoubleClicked={e => ok(e.data ?? null)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
