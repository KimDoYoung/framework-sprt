/**
 * 게시물 분류목록 조회창 (Z13) — Bbs30_Lookup_ClassTree 세부항목의 "이동" 아이콘이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs30_Lookup_ParentTree.java (138줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L47-61: 모달 "게시물 분류목록" 330×600, 그리드(buildGrid01 L78-84: 체크 단일, 게시물 분류명 200 · 사용 50(✓)), 아래 가운데 [이동][닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Space, message } from 'antd';
import { bbsBoardApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsClassTree } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BbsClassTree>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  /** 옮길 세부항목 — 있으면 열린다 (AS-IS open(classTreeModel, callback)) */
  target: BbsClassTree | null;
  /** [이동] 성공 (callback.execute()) — 부르는 쪽이 목록을 다시 읽는다. 닫는 것은 이 창이 onClose로 */
  onMoved: () => void;
  onClose: () => void;
}

export const Bbs30_Lookup_ParentTree: React.FC<Props> = ({ target, onMoved, onClose }) => {
  const [rows, setRows] = useState<BbsClassTree[]>([]);
  const [selected, setSelected] = useState<BbsClassTree | undefined>(undefined);

  // [E0] 열림 (open L41-45, 생성자 L47-61) → retrieve() L86-96: 서비스 bbs.Bbs30_ClassTree.selectByTypeCode(companyId, typeCode="C")
  useEffect(() => {
    if (!target) return;
    setSelected(undefined);
    bbsBoardApi.searchClassTrees('C').then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [target]);

  const columnDefs = useMemo(() => [
    gb.text('classTreeNm', 200, '게시물 분류명'),  // L81
    gb.booleanYn2('useYn', 50, '사용'),  // L82
  ], []);

  // [E1] moveButton[이동].Select (L64) → update() L98-133: 선택이 없으면 안내, 확인 "해당 항목을 이동하시겠습니까?" → [E3] msgBox.DialogHide [YES] (L106) → bbs.Bbs30_ClassTree.updateParentTreeId → callback, hide
  const update = () => {
    if (!selected) return message.warning('이동할 상위 게시물 분류명을 선택해주세요');
    Modal.confirm({
      title: '확인',
      content: '해당 항목을 이동하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await bbsBoardApi.updateParentTreeId(target!.classTreeId, selected.classTreeId);
          onMoved();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '이동 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={target != null}
      title={<b>게시물 분류목록</b>}
      width={420}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="move" onClick={update}>이동</Button>
            {/* [E2] closeButton[닫기].Select (L70) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'min(480px, calc(100vh - 230px))' }}>
        <SingleGrid<BbsClassTree>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.classTreeId)}
          rowSelection={SINGLE_SELECTION}
          onSelect={setSelected}
        />
      </div>
    </LookupModal>
  );
};
