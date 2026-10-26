/**
 * 주간사List 창 (Q04) — 공모주 일정조회(Sch10_Tab_Ipo)에서 주간사가 여럿인 행의 [바로가기]로 연다
 * AS-IS: myApp/client/vi/sch/Sch12_Lookup_IpoCorpList.java (133줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-96: 모달 600×500 "주간사List", 위 툴바 50([조회] + 안내 "※ 더블클릭시 해당 홈페이지로 이동됩니다." 4472C4) + 단일 체크 그리드(주간사명 200 · 홈페이지주소 300), 아래 가운데 [닫기]
 * open(corpName, callback) L44-48 → retrieve() L109-124: sch.Sch12_IpoCorp.selectByCorpNameList. 결과가 없으면 "해당 주간사에 대한 주소가 없습니다. 관리자에게 문의해주세요." 뒤 닫는다
 */
import React, { useCallback, useEffect } from 'react';
import { message } from 'antd';
import { schApi } from '@/api/sch';
import { Sch12IpoCorp } from '@/types/sch';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch12IpoCorp>();

/** buildGrid() L98-107 (setChecked SINGLE) */
const COLUMNS = [
  gb.text('corpName', 200, '주간사명'),        // L103
  gb.text('homepage', 300, '홈페이지주소'),    // L104
];

interface Props {
  /** open(corpName, callback) — 쉼표로 이은 주간사명. 값이 있으면 열린다 */
  corpName: string | null;
  /** callback.execute(selectModel) — 더블클릭한 행 */
  onResult: (row: Sch12IpoCorp) => void;
  onClose: () => void;
}

export const Sch12_Lookup_IpoCorpList: React.FC<Props> = ({ corpName, onResult, onClose }) => {
  const crud = useGridCrud<Sch12IpoCorp>({
    idField: 'ipoCorpId',
    search: useCallback(async () => {
      if (corpName == null) return [];
      const list = await schApi.searchIpoCorpsByNames(corpName);
      if (list.length === 0) {
        message.warning('해당 주간사에 대한 주소가 없습니다. 관리자에게 문의해주세요.');
        onClose();
      }
      return list;
    }, [corpName]),  // eslint-disable-line react-hooks/exhaustive-deps
    save: useCallback(async (rows: Sch12IpoCorp[]) => rows, []),
    remove: useCallback(async () => 0, []),
    newRow: () => ({}),
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L50-96, open L44-48) → retrieve()
  useEffect(() => {
    if (corpName != null) void retrieve();
  }, [corpName, retrieve]);

  return (
    <LookupModal
      open={corpName != null}
      title="주간사List"
      width={590}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancleButton[닫기].Select (L63) → hide() — 원본은 어디에도 붙지 않지만 창 아래 버튼 줄(getButtonBar)에는 있다 */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 340 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L57) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          <span style={{ color: '#4472C4', fontSize: 12 }}>※ 더블클릭시 해당 홈페이지로 이동됩니다.</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E3] grid.CellDoubleClick (L69) → callback(selectModel) */}
          <SingleGrid<Sch12IpoCorp> rowData={crud.rows} columnDefs={COLUMNS} getRowId={p => String(p.data.ipoCorpId)}
            onRowDoubleClicked={e => { if (e.data) onResult(e.data); }} />
        </div>
      </div>
    </LookupModal>
  );
};
