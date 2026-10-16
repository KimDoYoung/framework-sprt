/**
 * 매뉴권한복사(초기) 조회창 (A15) — Sys01_Tab_Company [매뉴권한복사(초기)]에서 연다.
 * AS-IS: myApp/client/vi/sys/Sys03_Lookup_CompanyMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useEffect, useState } from 'react';
import { message, Modal, Select, Space, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';

interface Props {
  open: boolean;
  /** AS-IS callback.execute(): 그리드 unmask */
  onClose: () => void;
}

export const Sys03_Lookup_CompanyMenu: React.FC<Props> = ({ open, onClose }) => {
  // outPutCombo / inPutCombo: CommonComboBoxField("sys.Sys00_Common.selectCompanyInfo") — 값 회사 ID, 표시 서브도메인
  const [companies, setCompanies] = useState<Code[]>([]);
  const [outPut, setOutPut] = useState<string>();
  const [inPut, setInPut] = useState<string>();
  const [saving, setSaving] = useState(false);

  // open() L40-76: 화면 열림
  useEffect(() => {
    if (!open) return;
    setOutPut(undefined);
    setInPut(undefined);
    sysApi.searchCompanyOptions().then(setCompanies).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open]);

  const nameOf = (code?: string) => companies.find(c => c.code === code)?.name ?? '';

  // [E1] insertButton[복사].Select (L57) → insertCheck() L78-107
  const insertCheck = () => {
    if (!outPut) return message.warning('출발지 값은 필수입력 항목입니다');
    if (!inPut) return message.warning('도착지 값은 필수입력 항목입니다');
    Modal.confirm({
      title: '확인',
      content: `[ ${nameOf(outPut)} ] 의 메뉴권한을 [ ${nameOf(inPut)} ] 으로 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 480,
      onOk: () => insert(), // [E3] msgBox.DialogHide [YES] (L91) → insert()
    });
  };

  // insert() L109-127: 서비스 sys.Sys03_CompanyMenu.insert(outPut, inPut)
  const insert = async () => {
    setSaving(true);
    try {
      await sysApi.copyCompanyMenus(Number(outPut), Number(inPut));
      message.info('생성이 완료되었습니다');
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '데이터를 불러올수 없습니다. 관리자에게 문의해주세요'));
    } finally {
      setSaving(false);
    }
  };

  const options = companies.map(c => ({ value: c.code, label: c.name || `(${c.code})` }));
  const combo = (label: string, value: string | undefined, onChange: (v: string) => void) => (
    <Space>
      <Typography.Text style={{ width: 80, display: 'inline-block' }}>{label}</Typography.Text>
      <Select style={{ width: 150 }} showSearch optionFilterProp="label" value={value} onChange={onChange} options={options} />
    </Space>
  );

  return (
    <Modal
      open={open}
      title="매뉴권한복사(초기)"
      width={550}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="change" onClick={insertCheck} loading={saving}>복사</Button>
            {/* [E2] closeButton[닫기].Select (L64) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Space size={20} style={{ padding: '20px 0' }}>
        {combo('출발지', outPut, setOutPut)}
        {combo('도착지', inPut, setInPut)}
      </Space>
    </Modal>
  );
};
