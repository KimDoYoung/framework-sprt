/**
 * 마감문자발송 창 (U15) — Biz01_Tab_CardManagement의 [마감문자발송]에서 연다
 * AS-IS: myApp/client/vi/biz/Biz01_Lookup_Message.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-87: 모달 350×350(크기 고정), 제목 "마감문자발송", 사원명 그리드(체크박스 다중, 열 1개 120) + 아래 가운데 [발송][닫기]
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { bizCardManagementApi, bizPromoApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { BizCodeOption } from '@/types/biz';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizCodeOption>();

interface Props {
  open: boolean;
  /** open(dataYMText) — 기준년월 'yyyy.MM' */
  dataYm: string;
  onClose: () => void;
}

export const Biz01_Lookup_Message: React.FC<Props> = ({ open, dataYm, onClose }) => {
  const [rows, setRows] = useState<BizCodeOption[]>([]);
  const [checked, setChecked] = useState<BizCodeOption[]>([]);

  // [E0] 화면 열림 (생성자 L58-87) → show() · open(dataYMText) L52-56 → setting(), retrieve()
  // [E1 생략] anchor.MouseDown (L66) 새로고침 아이콘 — 원본도 레이아웃에 넣지 않아(L79 주석) 화면에 없다
  // [E2 생략] retrieveButton[조회].Select (L90) — 같은 사유(버튼이 창에 붙어 있지 않다). 열 때 한 번 조회한다
  // retrieve() L150-161: 서비스 sys.Sys00_Common.selectBizCardManager(companyId, stdYYYYMM)
  useEffect(() => {
    if (!open) return;
    setChecked([]);
    bizPromoApi.searchCardManagers(dataYm)
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, dataYm]);

  // [E3] updateButton[발송].Select (L96) → sendMessage() L118-140: 고른 사원이 없으면 "발송할 사원정보를 선택해주세요"
  //   → 서비스 biz.Biz01_Promo.sendMessage(content "[Asset-ERP] 법인카드 사용내역 (yyyy.MM)이 마감되었습니다.", 고른 사원들) → "정상적으로 발송완료되었습니다"
  const sendMessage = async () => {
    if (checked.length === 0) {
      message.warning('발송할 사원정보를 선택해주세요');
      return;
    }
    try {
      await bizCardManagementApi.sendMessage(dataYm, checked.map(r => Number(r.code)));
      message.success('정상적으로 발송완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '일치하는 정보가 없습니다'));
    }
  };

  // buildGrid() L110-116: 행번호 + 체크박스(다중) + 사원명
  const columnDefs = useMemo(() => [gb.textCenter('name', 120, '사원명')], []);

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>마감문자발송</span>}
      width={350}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Button type="send" onClick={sendMessage}>발송</Button>
          {/* [E4] closeButton[닫기].Select (L102) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </div>
      )}
    >
      <div style={{ height: 230, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <MultiGrid<BizCodeOption>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => p.data.code}
          rowClick
          onCheckedChange={setChecked}
        />
      </div>
    </LookupModal>
  );
};
