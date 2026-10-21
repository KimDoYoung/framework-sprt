/**
 * 종목유형 창 (I02) — Flt03_Tab_AccountReport 종목유형 칸에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt03_Lookup_ItemType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L94-164: 340×310 모달, 체크박스 6개(2열×3줄) + 안내 문구 + [저장][닫기]. open(itemType, callback) L43: 6자리 "101000"의 자리별 1이면 체크
 * 색인이 [저장][닫기]를 "도달 불가"로 표시했지만 getButtonBar()에 붙어 있어 도달한다(L140-141)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const LABELS = ['지분증권', '증권예탁증서', '주권관련 사채권', '파생결합증권', '장내파생상품', '장외파생상품'];  // L101-123 (itemId 10·20·…·60)

export interface ItemTypeResult {
  itemType: string;
  itemTypeName: string;
}

interface Props {
  open: boolean;
  /** open(itemType, callback) L43: 고른 행의 종목유형 6자리. 없으면 모두 해제 */
  itemType: string | null;
  /** callback.execute(resultModel) L222: itemType·itemTypeName */
  onResult: (result: ItemTypeResult) => void;
  onClose: () => void;
}

export const Flt03_Lookup_ItemType: React.FC<Props> = ({ open, itemType, onResult, onClose }) => {
  const [checked, setChecked] = useState<boolean[]>(LABELS.map(() => false));

  // [E0] 화면 열림 (생성자 L94-164) → show() / checkBox() L52-88: 자리별 "1"이면 체크
  useEffect(() => {
    if (!open) return;
    setChecked(LABELS.map((_, i) => itemType != null && itemType.charAt(i) === '1'));
  }, [open, itemType]);

  // [E1] updateButton[저장].Select (L127) → update() L166-227
  const update = async () => {
    const value = checked.map(c => (c ? '1' : '0')).join('');
    if (!value.includes('1')) {
      message.warning('한 개 이상의 종목유형을 선택해주세요');
      return;
    }
    try {
      const itemTypeName = await fltApi.getItemTypeName(value);  // flt.Flt03_Account.getItemTypeName
      onResult({ itemType: value, itemTypeName });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="종목유형"
      width={340}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L133) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ fontSize: 14, fontWeight: 'bold' }}>
        {[0, 1, 2].map(row => (
          <div key={row} style={{ display: 'flex', height: 50, alignItems: 'center' }}>
            {[0, 1].map(col => {
              const i = row * 2 + col;
              return (
                <div key={i} style={{ width: 160, margin: 15 }}>
                  <Checkbox checked={checked[i]} onChange={e => setChecked(prev => prev.map((v, j) => (j === i ? e.target.checked : v)))}>
                    <b style={{ fontSize: 14 }}>{LABELS[i]}</b>
                  </Checkbox>
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ margin: '20px 15px 15px' }}>* 한개이상 선택 가능합니다</div>
      </div>
    </LookupModal>
  );
};
