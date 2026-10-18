/**
 * 법규 연결 창 (E16) — Dcr01_Grid_DocType의 "법규연결" 칸 아이콘에서 연다 (문서구분에 법규를 연결한다)
 * AS-IS: myApp/client/vi/dcr/Dcr20_Lookup_Ics.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-135: 모달 1200×500 "법규 연결", 위 툴바([행 추가][행 삭제] + 오른쪽 새로고침 아이콘) + 체크박스 다중 그리드(법규명 300 · 상세내용 400 · 제출처 150 · 주기 100 · 관련조문 200 · 분류코드 70), 아래 가운데 [저장][닫기]
 * open()/openUser() L56-67은 같은 일을 한다(openUser의 단추 숨김은 원본에서 주석 처리) — 관리자 연결의 전파는 서버가 한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrRelateIcs } from '@/types/dcr';
import { IcsLawLookup } from '@/types/ics';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Ics01_Lookup_SelectMulti } from '@/pages/ics/Ics01_Lookup_SelectMulti';

const gb = gbFor<DcrRelateIcs>();

/** addTextLimitArea: 줄바꿈을 유지하고 높이 300에서 자른다 (읽기 전용) */
const textLimitArea = (field: keyof DcrRelateIcs & string, width: number, header: string) => ({
  ...gb.text(field, width, header),
  autoHeight: true,
  cellRenderer: (p: { value?: string | null }) =>
    p.value ? <div style={{ maxHeight: 300, overflow: 'hidden', whiteSpace: 'pre-wrap', lineHeight: '20px', padding: '4px 0' }}>{p.value}</div> : ' ',
});

interface Props {
  /** open(dcrClassTreeId)·openUser(dcrClassTreeId) — 문서구분 ID (값이 있으면 열린다) */
  dcrClassTreeId: number | null;
  /** 저장·삭제가 끝났을 때 — 부른 쪽(문서구분 그리드)이 법규연결 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Dcr20_Lookup_Ics: React.FC<Props> = ({ dcrClassTreeId, onChanged, onClose }) => {
  const [lookupOpen, setLookupOpen] = useState(false);
  const deleteList = useRef<number[]>([]);  // 행 삭제로 뺀 행 — 저장 때 지운다 (AS-IS deleteList)

  // buildGrid() L137-152: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.textArea('classTreeFullName', 300, '법규명'),  // L141
    textLimitArea('content', 400, '상세내용'),  // L142 addTextLimitArea
    gb.textArea('submitTo', 150, '제출처'),  // L143
    gb.text('cycleName', 100, '주기'),  // L144
    gb.textArea('relatedLaw', 200, '관련조문'),  // L145
    gb.text('classTreeCode', 70, '분류코드'),  // L146
  ], []);

  const crud = useGridCrud<DcrRelateIcs>({
    idField: 'relateIcsId',
    // retrieve() L192-198: deleteList를 비우고 서비스 dcr.Dcr20_RelateIcs.selectByDcrClassTreeId(dcrClassTreeId)
    search: useCallback(() => {
      deleteList.current = [];
      return dcrClassTreeId == null ? Promise.resolve([]) : dcrApi.searchRelateIcs(dcrClassTreeId);
    }, [dcrClassTreeId]),
    // update() L200-211: GridUpdate → dcr.Dcr20_RelateIcs.update (새 연결)
    save: rows => dcrApi.saveRelateIcs(rows.map(r => ({ relateId: r.relateIcsId, dcrClassTreeId: r.dcrClassTreeId, targetClassTreeId: r.icsClassTreeId!, note: r.note }))),
    remove: dcrApi.deleteRelateIcs,
    newRow: useCallback(() => ({ dcrClassTreeId: dcrClassTreeId ?? 0 }), [dcrClassTreeId]),
  });

  // [E0] 화면 열림 (생성자 L69-135) → show(), retrieve()
  useEffect(() => {
    if (dcrClassTreeId == null) return;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dcrClassTreeId]);

  // [E2] insertButton[행 추가].Select (L85) → insertRow() L154-182: Ics01_Lookup_SelectMulti("classTree")에서 고른 법규마다 행을 더한다 (법규ID·법규명·분류코드를 addChange)
  const insertRow = (list: IcsLawLookup[]) => {
    crud.addRows(list.map(m => ({ icsClassTreeId: m.classTreeId, classTreeFullName: m.classTreeFullName, classTreeCode: m.classTreeCode })), true);
  };

  // [E3] deleteButton[행 삭제].Select (L91) → deleteRow() L184-190: 체크한 행을 deleteList에 모으고 그리드에서 뺀다 (저장 때 지운다)
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    deleteList.current.push(...checked.map(r => r.relateIcsId));
    crud.removeRows(checked.map(r => r.relateIcsId));
  };

  // [E4] updateButton[저장].Select (L98) → update() L200-211: 변경 행 저장(GridUpdate) → deleteList 삭제(GridDeleteData)
  const update = async () => {
    await crud.saveRows();
    const ids = deleteList.current.filter(id => id > 0);
    if (ids.length > 0) {
      try {
        await dcrApi.deleteRelateIcs(ids);
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
      <Modal
        open={dcrClassTreeId != null}
        title="법규 연결"
        width={1200}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E5] cancleButton[닫기].Select (L104) → hide() */}
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
            {/* [E1] anchor.MouseDown (L79) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer', marginRight: 5 }} onClick={() => void crud.retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<DcrRelateIcs> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </Modal>
      <Ics01_Lookup_SelectMulti open={lookupOpen} actionCode="classTree" onResult={insertRow} onClose={() => setLookupOpen(false)} />
    </>
  );
};
