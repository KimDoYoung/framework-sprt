/**
 * 문서양식 연결 창 (E16) — Dcr01_Grid_DocType의 "양식지정" 칸 아이콘에서 연다 (문서구분에 문서양식을 연결한다)
 * AS-IS: myApp/client/vi/dcr/Dcr06_Lookup_Form.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-127: 모달 800×500 "문서양식 연결", 위 툴바([행 추가][행 삭제] + 오른쪽 새로고침 아이콘) + 체크박스 다중 그리드(양식 제목 450 · 대표양식 60 · 비고 180), 아래 가운데 [저장][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrDocType, DcrRelateDocType } from '@/types/dcr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Dcr05_Lookup_DocType } from './Dcr05_Lookup_DocType';

const gb = gbFor<DcrRelateDocType>();

interface Props {
  /** open(classTreeId) L60 — 문서구분 ID (값이 있으면 열린다) */
  classTreeId: number | null;
  /** 저장·삭제가 끝났을 때 — 부른 쪽(문서구분 그리드)이 양식지정 건수를 다시 읽는다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Dcr06_Lookup_Form: React.FC<Props> = ({ classTreeId, onChanged, onClose }) => {
  const [lookupOpen, setLookupOpen] = useState(false);
  const deleteList = useRef<number[]>([]);  // 행 삭제로 뺀 행 — 저장 때 지운다 (AS-IS deleteList)

  // buildGrid() L129-137: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.text('title', 450, '양식 제목'),  // L133
    gb.boolean('defaultYn', 60, '대표양식', { editable: true }),  // L134
    gb.text('note', 180, '비고', { editor: 'text' }),  // L135
  ], []);

  const crud = useGridCrud<DcrRelateDocType>({
    idField: 'relateDocTypeId',
    // retrieve() L174-180: deleteList를 비우고 서비스 dcr.Dcr06_RelateDocType.selectByClassTreeId(classTreeId)
    search: useCallback(() => {
      deleteList.current = [];
      return classTreeId == null ? Promise.resolve([]) : dcrApi.searchRelateDocTypes(classTreeId);
    }, [classTreeId]),
    // update() L215-226: GridUpdate → dcr.Dcr06_RelateDocType.update
    save: dcrApi.saveRelateDocTypes,
    remove: dcrApi.deleteRelateDocTypes,
    newRow: useCallback(() => ({ classTreeId: classTreeId ?? 0 }), [classTreeId]),
  });

  // [E0] 화면 열림 (생성자 L65-127) → show() / open() L60-63 → retrieve()
  useEffect(() => {
    if (classTreeId == null) return;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId]);

  // [E2] insertButton[행 추가].Select (L80) → insertRow() L139-164: Dcr05_Lookup_DocType에서 고른 양식마다 행을 더한다 (양식ID·제목·대표양식 false를 addChange)
  const insertRow = (list: DcrDocType[]) => {
    crud.addRows(list.map(m => ({ docTypeId: m.docTypeId, title: m.title, defaultYn: 'false' })), true);
  };

  // [E3] deleteButton[행 삭제].Select (L86) → deleteRow() L166-172: 체크한 행을 deleteList에 모으고 그리드에서 뺀다 (저장 때 지운다)
  const deleteRow = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    deleteList.current.push(...checked.map(r => r.relateDocTypeId));
    crud.removeRows(checked.map(r => r.relateDocTypeId));
  };

  // update() L215-226: 변경 행 저장(GridUpdate) → deleteList 삭제(GridDeleteData)
  const update = async () => {
    await crud.saveRows();
    const ids = deleteList.current.filter(id => id > 0);
    if (ids.length > 0) {
      try {
        await dcrApi.deleteRelateDocTypes(ids);
        message.success(`${ids.length}건 삭제되었습니다.`);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
        return;
      }
    }
    deleteList.current = [];
    onChanged?.();
  };

  // [E4] updateButton[저장].Select (L92) → updateCheck() L182-213: 저장할 모든 행 중 대표양식이 둘 이상이면 "대표양식은 하나만 지정가능합니다", 아니면 update()
  const updateCheck = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const defaultYnCount = crud.rows.filter(r => r.defaultYn === 'true').length;
    if (defaultYnCount === 1 || defaultYnCount === 0) await update();
    else message.warning('대표양식은 하나만 지정가능합니다');
  };

  return (
    <>
      <Modal
        open={classTreeId != null}
        title="문서양식 연결"
        width={800}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={updateCheck}>저장</Button>
              {/* [E5] cancleButton[닫기].Select (L98) → hide() */}
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
            {/* [E1] anchor.MouseDown (L74) → retrieve() */}
            <ReloadOutlined style={{ cursor: 'pointer', marginRight: 5 }} onClick={() => void crud.retrieve()} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<DcrRelateDocType> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </Modal>
      <Dcr05_Lookup_DocType open={lookupOpen} onResult={insertRow} onClose={() => setLookupOpen(false)} />
    </>
  );
};
