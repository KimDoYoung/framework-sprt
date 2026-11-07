/**
 * 그룹 상세정보 창 (Z02) — Emp57_Lookup_List의 그룹 줄 "보기" 아이콘이 연다
 * AS-IS: myApp/client/vi/emp/Emp57_Lookup_DetailList.java (79줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L27-43: 모달 "상세정보" 1000×600, 그리드(buildGrid L54-63: 구분 50 · 담당자/사원명 250 · 이메일 220 · 핸드폰 번호 120 · 비고 500), 아래 가운데 [닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { empAddrBookApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { EmpAddrBookSelect } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<EmpAddrBookSelect>();

interface Props {
  /** 그룹 ID — 값이 있으면 열린다 (AS-IS open(parentId)) */
  parentId: number | null;
  onClose: () => void;
}

export const Emp57_Lookup_DetailList: React.FC<Props> = ({ parentId, onClose }) => {
  const [rows, setRows] = useState<EmpAddrBookSelect[]>([]);

  // retrieve() L65-74: 서비스 emp.Emp57_AddrBookGroup.selectByParentId(parentId)
  useEffect(() => {
    if (parentId == null) return;
    empAddrBookApi.searchGroupSelectItems(parentId).then(setRows).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [parentId]);

  const columnDefs = useMemo(() => [
    gb.textCenter('parentGubun', 50, '구분'),  // L56
    gb.text('parentName', 250, '담당자/사원명'),  // L57
    gb.text('emailAddress', 220, '이메일'),  // L58
    gb.text('mobileTelNo', 120, '핸드폰 번호'),  // L59
    gb.text('note', 500, '비고'),  // L60
  ], []);

  return (
    <LookupModal
      open={parentId != null}
      title="상세정보"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] cancelButton[닫기].Select (L45) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 440 }}>
        <SingleGrid<EmpAddrBookSelect> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.addrBookGroupId)} />
      </div>
    </LookupModal>
  );
};
