/**
 * 내규 연결 창 (E16) — Dcr01_Grid_DocType의 "내규연결" 칸 아이콘에서 연다 (문서구분에 내규를 연결한다)
 * AS-IS: myApp/client/vi/dcr/Dcr21_Lookup_Icr.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L66-132: Dcr20_Lookup_Ics와 같은 창. 모달 1200×500 "내규 연결", 위 툴바([행 추가][행 삭제] + 오른쪽 새로고침 아이콘) + 체크박스 다중 그리드(내규명 300 · 상세내용 400 · 제출처 150 · 주기 100 · 관련조문 200 · 분류코드 70), 아래 가운데 [저장][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { ReloadOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrRelateIcr } from '@/types/dcr';
import { IcrClassTreeLookup } from '@/types/icr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Icr01_Lookup_SelectMulti } from '@/pages/icr/Icr01_Lookup_SelectMulti';

const gb = gbFor<DcrRelateIcr>();

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof DcrRelateIcr & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface Props {
  /** open(dcrClassTreeId)·openUser(dcrClassTreeId) — 문서구분 ID (값이 있으면 열린다) */
  dcrClassTreeId: number | null;
  /** 저장·삭제가 끝났을 때 — 부른 쪽(문서구분 그리드)이 내규연결 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Dcr21_Lookup_Icr: React.FC<Props> = ({ dcrClassTreeId, onChanged, onClose }) => {
  const [lookupOpen, setLookupOpen] = useState(false);
  const deleteList = useRef<number[]>([]);  // 행 삭제로 뺀 행 — 저장 때 지운다 (AS-IS deleteList)

  // buildGrid() L134-146: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.textArea('classTreeFullName', 300, '내규명'),  // L138
    textLimitArea('content', 400, '상세내용'),  // L139 addTextLimitArea
    gb.textArea('submitTo', 150, '제출처'),  // L140
    gb.text('cycleName', 100, '주기'),  // L141
    gb.textArea('relatedLaw', 200, '관련조문'),  // L142
    gb.text('classTreeCode', 70, '분류코드'),  // L143
  ], []);

  const crud = useGridCrud<DcrRelateIcr>({
    idField: 'relateIcrId',
    // retrieve() L186-192: deleteList를 비우고 서비스 dcr.Dcr21_RelateIcr.selectByDcrClassTreeId(dcrClassTreeId)
    search: useCallback(() => {
      deleteList.current = [];
      return dcrClassTreeId == null ? Promise.resolve([]) : dcrApi.searchRelateIcr(dcrClassTreeId);
    }, [dcrClassTreeId]),
    // update() L194-205: GridUpdate → dcr.Dcr21_RelateIcr.update (새 연결)
    save: rows => dcrApi.saveRelateIcr(rows.map(r => ({ relateId: r.relateIcrId, dcrClassTreeId: r.dcrClassTreeId, targetClassTreeId: r.icrClassTreeId!, note: r.note }))),
    remove: dcrApi.deleteRelateIcr,
    newRow: useCallback(() => ({ dcrClassTreeId: dcrClassTreeId ?? 0 }), [dcrClassTreeId]),
  });

  // [E0] 화면 열림 (생성자 L66-132) → show(), retrieve()
  useEffect(() => {
    if (dcrClassTreeId == null) return;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dcrClassTreeId]);

  // [E2] insertButton[행 추가].Select (L82) → insertRow() L148-176: Icr01_Lookup_SelectMulti("classTree")에서 고른 내규마다 행을 더한다 (내규ID·내규명·분류코드를 addChange)
  const insertRow = (list: IcrClassTreeLookup[]) => {
    crud.addRows(list.map(m => ({ icrClassTreeId: m.classTreeId, classTreeFullName: m.classTreeFullName, classTreeCode: m.classTreeCode })), true);
  };

  // [E3] deleteButton[행 삭제].Select (L88) → deleteRow() L178-184: 체크한 행을 deleteList에 모으고 그리드에서 뺀다 (저장 때 지운다)
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    deleteList.current.push(...checked.map(r => r.relateIcrId));
    crud.removeRows(checked.map(r => r.relateIcrId));
  };

  // [E4] updateButton[저장].Select (L95) → update() L194-205: 변경 행 저장(GridUpdate) → deleteList 삭제(GridDeleteData)
  const update = async () => {
    await crud.saveRows();
    const ids = deleteList.current.filter(id => id > 0);
    if (ids.length > 0) {
      try {
        await dcrApi.deleteRelateIcr(ids);
        message.success(`${ids.length}건 삭제되었습니다.`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
        return;
      }
    }
    deleteList.current = [];
    onChanged?.();
  };

  return (
    <>
      <LookupModal
        open={dcrClassTreeId != null}
        title="내규 연결"
        width={1200}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E5] cancleButton[닫기].Select (L101) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 45, flex: 'none' }}>
            <Space style={{ flex: 1 }}>
              <Button type="addRow" onClick={() => setLookupOpen(true)}>행 추가</Button>
              <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            </Space>
            {/* [E1] anchor.MouseDown (L76) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer', marginRight: 5 }} onClick={() => void crud.retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<DcrRelateIcr> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </LookupModal>
      <Icr01_Lookup_SelectMulti open={lookupOpen} actionCode="classTree" onResult={insertRow} onClose={() => setLookupOpen(false)} />
    </>
  );
};
