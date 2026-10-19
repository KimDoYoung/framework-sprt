/**
 * 파일보관함 기록 창 (F11) — 파일등록 그리드의 "기록" 아이콘이 연다
 * AS-IS: myApp/client/vi/fbx/Fbx02_Popup_History.java (80줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 기록 그리드(SingleGrid, 행번호) + [닫기]. 열 때 조회(selectByBoxId)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { fbxApi } from '@/api/fbx';
import { errorMessage } from '@/api/client';
import { FbxHistory } from '@/types/fbx';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FbxHistory>();

interface Props {
  /** 값이 있으면 열린다 (AS-IS open(boxId)) */
  boxId: number | null;
  onClose: () => void;
}

export const Fbx02_Popup_History: React.FC<Props> = ({ boxId, onClose }) => {
  const [rows, setRows] = useState<FbxHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // [E0] 화면 열림 (생성자 L27-44) → show() — 서비스 fbx.Fbx02_History.selectByBoxId(boxId, companyId)
  useEffect(() => {
    if (boxId == null) return;
    setRows([]);
    setLoading(true);
    fbxApi.searchHistories(boxId)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setLoading(false));
  }, [boxId]);

  const columnDefs = useMemo(() => [
    gb.dateTime('actDate', 150, '일자'),
    gb.textCenter('actName', 80, '동작'),
    gb.text('actContent', 320, '내용'),
    gb.text('actEmpName', 100, '생성자'),
    gb.text('actOrgName', 100, '부서'),
  ], []);

  return (
    <LookupModal
      open={boxId != null}
      title="기록"
      width={850}
      closable={false}
      maskClosable={false}
      footer={
        // [E1] closeButton[닫기].Select (L34) → hide()
        <Button type="close" onClick={onClose}>닫기</Button>
      }
    >
      <div style={{ height: 400 }}>
        <SingleGrid<FbxHistory> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.historyId)} loading={loading} />
      </div>
    </LookupModal>
  );
};
