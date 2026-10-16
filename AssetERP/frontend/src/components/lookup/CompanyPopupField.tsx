/**
 * 고객사 선택 칸 (IM-01, B13) — 입력 + x. 누르면 Sys01_Lookup_Company 조회창을 연다.
 * AS-IS CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체") 대신 쓴다.
 * 값은 회사 ID 문자열, 전체는 all('%')로 화면의 기존 ALL 규약을 그대로 쓴다.
 * 조회창에서 선택안함 / x = 전체.
 */
import React, { useState } from 'react';
import { Input } from 'antd';
import { Company } from '@/types/sys';
import { Sys01_Lookup_Company } from './Sys01_Lookup_Company';

interface Props {
  /** 회사 ID 문자열, 전체면 all */
  value: string;
  /** value가 전체가 아닐 때 보여 줄 이름. 안 주면 이 칸에서 마지막에 고른 회사 이름 */
  label?: string;
  /** code = 회사 ID 문자열 또는 all, name = 회사명 또는 '전체' */
  onChange: (code: string, name: string) => void;
  /** 전체를 뜻하는 값. 기본 '%' */
  all?: string;
  width?: number;
  disabled?: boolean;
}

export const CompanyPopupField: React.FC<Props> = ({ value, label, onChange, all = '%', width = 200, disabled }) => {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('');
  const isAll = value === all;
  const text = isAll ? '전체' : (label ?? picked);

  const onResult = (company: Company | null) => {
    setOpen(false);
    if (company == null) {
      onChange(all, '전체');
      return;
    }
    setPicked(company.companyNm);
    onChange(String(company.companyId), company.companyNm);
  };

  return (
    <>
      <Input
        style={{ width, cursor: disabled ? 'not-allowed' : 'pointer' }}
        // readOnly면 antd가 x를 숨기므로 키 입력·붙여넣기만 막는다
        onKeyDown={e => { if (e.key !== 'Tab') e.preventDefault(); }}
        onPaste={e => e.preventDefault()}
        disabled={disabled}
        value={text}
        allowClear={!isAll && !disabled}
        onChange={e => { if (e.target.value === '') onChange(all, '전체'); }}
        onClick={() => !disabled && setOpen(true)}
      />
      <Sys01_Lookup_Company open={open} onResult={onResult} onClose={() => setOpen(false)} />
    </>
  );
};
