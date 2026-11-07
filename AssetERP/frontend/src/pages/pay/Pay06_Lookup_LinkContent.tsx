/**
 * 연봉계약서 선택 (V26) — Pay01_Tab_Annual의 [상신]에서 계약서 양식이 둘 이상일 때 연다.
 * AS-IS: myApp/client/vi/pay/Pay06_Lookup_LinkContent.java (108줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L42-69: 900×250 모달 "연봉계약서 선택", 단일 선택 그리드(제목 400 · 비고 400) + 아래 가운데 [확인][닫기]
 * open(menuCode, kindCode, callback) L35-40 → retrieve() L91-103: pay.Pay06_ActMapping.selectByLinkCode(companyId, kindCode, linkCode)
 *   — TOBE는 호출한 화면이 같은 API(`GET pay/annuals/{id}/link-contents`)로 이미 읽은 목록을 `rows`로 받는다.
 * [E0] 화면 열림 (생성자) → show() 뒤 retrieve()
 * [E1] confirmButton[확인].Select (L50) → confirm() L81-89: 한 행을 골랐으면 callback(그 행)+hide(), 아니면 "연봉계약서 양식을 선택해주세요"
 * [E2] closeButton[닫기].Select (L56) → callback(null), hide() (X 닫기 없음 — setClosable(false))
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { PayActMapping } from '@/types/pay';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<PayActMapping>();

interface Props {
  open: boolean;
  /** retrieve() 결과 — 이 사원 유형의 계약서 양식 후보 */
  rows: PayActMapping[];
  /** AS-IS callback.execute(model): [확인]이면 고른 양식, [닫기]면 null */
  onResult: (row: PayActMapping | null) => void;
}

export const Pay06_Lookup_LinkContent: React.FC<Props> = ({ open, rows, onResult }) => {
  const [selected, setSelected] = useState<PayActMapping | undefined>();

  // buildGrid() L71-79: 제목 400 · 비고 400 (행번호 보임)
  const columnDefs = useMemo(() => [
    gb.text('title', 400, '제목'),
    gb.text('note', 400, '비고'),
  ], []);

  useEffect(() => {
    if (open) setSelected(undefined);
  }, [open]);

  // [E1] confirm() L81-89
  const confirm = () => {
    if (!selected) {
      message.warning('연봉계약서 양식을 선택해주세요');
      return;
    }
    onResult(selected);
  };

  return (
    <LookupModal
      open={open}
      title="연봉계약서 선택"
      width={1000}
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={() => onResult(null)}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] confirmButton[확인].Select (L50) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E2] closeButton[닫기].Select (L56) → callback(null), hide() */}
            <Button type="close" onClick={() => onResult(null)}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ height: 150 }}>
        <SingleGrid<PayActMapping>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.actMappingId)}
          onSelect={setSelected}
        />
      </div>
    </LookupModal>
  );
};
