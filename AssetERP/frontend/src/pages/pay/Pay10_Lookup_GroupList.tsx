/**
 * 지급구분/일자 조회창 (S16) — Pay10_Tab_Month의 구분 칸에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_GroupList.java (176줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L66-131: 280×400 모달 "구분", 위 툴바(구분 콤보 100 = 코드그룹 PayMonthGroup001 "%"/"전체" · [조회]) + 단일 선택 그리드(분류 220), 아래 가운데 [확인][닫기]
 * open(year, code?, callback) L51-64: 열면서 바로 조회
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayMonthGroup } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayMonthGroup>();

interface Props {
  open: boolean;
  /** open(year, …) — 조회 년도 */
  year: string;
  /** open(year, code, …) — 코드그룹 구분 분기(sys 값 '001'이면 급여·상여만) */
  code?: string | null;
  /** AS-IS callback.execute(monthModel): [확인]·더블클릭이면 고른 행 (payCd·date·payGroupNm) */
  onResult: (group: PayMonthGroup) => void;
  onClose: () => void;
}

export const Pay10_Lookup_GroupList: React.FC<Props> = ({ open, year, code, onResult, onClose }) => {
  const [payCode, setPayCode] = useState<string>('%');
  const [rows, setRows] = useState<PayMonthGroup[]>([]);
  const [selected, setSelected] = useState<PayMonthGroup | undefined>();

  // buildGrid(): 분류 220 (행번호 보임)
  const columnDefs = useMemo(() => [gb.text('payGroupNm', 220, '분류')], []);

  // retrieve() L147-167: 구분 코드가 없으면 "%"
  const retrieve = useCallback(async (pc: string) => {
    try {
      setRows(await payApi.searchMonthGroups(year, pc || '%', code));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [year, code]);

  // [E0] 화면 열림 (생성자 L66-131) → show() 뒤 open()이 retrieve()
  useEffect(() => {
    if (!open) return;
    setPayCode('%');
    setSelected(undefined);
    void retrieve('%');
  }, [open, retrieve]);

  // select() L141-145: 고른 행으로 callback 뒤 닫기. 고른 행이 없으면 아무 일도 하지 않는다(원본은 null로 callback → 예외)
  const select = (row?: PayMonthGroup) => {
    const r = row ?? selected;
    if (!r) return;
    onResult(r);
  };

  return (
    <LookupModal
      open={open}
      title="구분"
      width={420}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] selectButton[확인].Select (L95) → select() */}
            <Button type="save" onClick={() => select()}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L101) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L89) → retrieve(). [E1] payName KeyPress Enter (L81) → retrieve() — SearchBar의 Enter가 같다 */}
        <SearchBar onSearch={() => retrieve(payCode)}>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindGroupCd="PayMonthGroup001" altCode={['%', '전체']} style={{ width: 100 }}
              value={payCode} onChange={c => setPayCode(c ?? '%')} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E5] grid.CellDoubleClick (L107) → select() */}
          <SingleGrid<PayMonthGroup>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => `${p.data.date}-${p.data.payCd}`}
            onSelect={setSelected}
            onRowDoubleClicked={e => select(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
