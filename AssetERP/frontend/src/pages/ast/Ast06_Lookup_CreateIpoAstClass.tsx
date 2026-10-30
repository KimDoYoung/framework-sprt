/**
 * IPO 종목정보 생성 창 (W05) — Ast06_Lookup_TrIPO의 [종목 생성하기] 링크가 연다
 * AS-IS: myApp/client/vi/ast/Ast06_Lookup_CreateIpoAstClass.java (117줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L35-54: 모달 380×160 "IPO 종목정보 생성", 종목명 입력 1칸(라벨 70) + 아래 가운데 [생성][닫기]
 * 편집창 규격(11 §4a): antd Modal + 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space } from 'antd';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { AstClassTree } from '@/types/ast';
import { Button } from '@/components/button';
import { FieldRow } from './Ast06_EditParts';

interface Props {
  open: boolean;
  /** 만든 종목 (AS-IS callback.execute(Ast01_ClassTreeModel) 뒤 hide) */
  onCreated: (item: AstClassTree) => void;
  onClose: () => void;
}

export const Ast06_Lookup_CreateIpoAstClass: React.FC<Props> = ({ open, onCreated, onClose }) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L35-54) → show()
  useEffect(() => { if (open) setName(''); }, [open]);

  // [E1] createButton[생성].Select (L63) → insertIpo() L78-108
  const insertIpo = async () => {
    if (name.trim() === '') { message.warning('종목명을 입력하세요'); return; }
    setSaving(true);
    try {
      const item = await astApi.createIpoClass(name);
      message.success('생성이 완료되었습니다.');
      onCreated(item);
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="IPO 종목정보 생성"
      width={380}
      maskClosable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={insertIpo} loading={saving}>생성</Button>
            {/* [E2] closeButton[닫기].Select (L70) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px' }}>
        <FieldRow label="종목명" labelWidth={70}>
          <Input autoFocus value={name} onChange={e => setName(e.target.value)} />
        </FieldRow>
      </div>
    </Modal>
  );
};
