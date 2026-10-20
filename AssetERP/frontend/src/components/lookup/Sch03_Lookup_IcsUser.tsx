/**
 * 법규 기한 조회창 (사용자용) — 법규조회(Ics01_Tab_ClassTreeUserView, H02)의 주기 아이콘에서 연다.
 * ics·icr 도메인이 쓰는 공통 조회창(IM-02) — 관리용 `Sch03_Lookup_Ics`(기본 기한 선택·일회성/반복 조건·삭제)와 달리 보기만 한다
 * AS-IS: myApp/client/vi/sch/Sch03_Lookup_IcsUser.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 makeLayout() L46-83: 모달 900×300 "법규 기한", 위 오른쪽 새로고침 아이콘, 그리드(체크박스 단일: 주기구분 120 · 처리일 정보 500 · 시작일 100 · 종료일 100), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch03Deadline } from '@/types/sch';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<Sch03Deadline>();

interface Props {
  /** open(classTreeId) L40-44 — 값이 있으면 열린다 */
  classTreeId: number | null;
  onClose: () => void;
}

export const Sch03_Lookup_IcsUser: React.FC<Props> = ({ classTreeId, onClose }) => {
  const [rows, setRows] = useState<Sch03Deadline[]>([]);

  // retrieve() L98-102: 서비스 sch.Sch03_Deadline.selectByClassTreeId(classTreeId) — 새로고침 아이콘(E1)도 같다
  const retrieve = useCallback(async () => {
    if (classTreeId == null) return;
    try {
      setRows(await schApi.searchDeadlines(classTreeId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [classTreeId]);

  // [E0] 화면 열림 (생성자 L36-38, open() L40-44) → makeLayout(), retrieve()
  useEffect(() => { setRows([]); void retrieve(); }, [retrieve]);

  // buildGrid() L86-96 (체크박스 단일)
  const columnDefs = useMemo(() => [
    gb.textCenter('cycleName', 120, '주기구분'),  // L91
    gb.text('deadlineFullName', 500, '처리일 정보'),  // L92
    gb.date('startDate', 100, '시작일'),  // L93
    gb.date('closeDate', 100, '종료일'),  // L94
  ], []);

  return (
    <LookupModal
      open={classTreeId != null}
      title="법규 기한"
      width={940}
      maskClosable={false}
      onCancel={onClose}
      footer={<div style={{ textAlign: 'center' }}>{/* [E2] closeButton[닫기].Select (L62) → hide() */}<Button type="close" onClick={onClose}>닫기</Button></div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 190, gap: 6 }}>
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          {/* [E1] anchor.MouseDown (L55) → retrieve() */}
          <ReloadOutlined style={{ cursor: 'pointer' }} title="새로고침" onMouseDown={() => { void retrieve(); }} />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch03Deadline>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.deadlineId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
