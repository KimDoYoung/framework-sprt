/**
 * 기타정보 탭 (C01-2) — Emp00_Tab_TransInfo 아래 탭 2번째.
 * AS-IS: myApp/client/vi/emp/Emp02_TabPage_Others.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 사원의 emp02_others를 폼으로 보여 주고 저장한다(emp02_others.upsert). 사진(E1~E3)은 파일 공통(B10) 뒤.
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Others } from '@/types/emp';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import type { TransInfoTabProps } from './Emp00_Tab_TransInfo';

/** AS-IS Emp02_OthersModel.getKorAge() L243-253: 올해 - 생년 + 1 */
const getKorAge = (b: Dayjs | null) => (b ? String(dayjs().year() - b.year() + 1) : '');

/** AS-IS Emp02_OthersModel.getAge() L260-274: 올해 - 생년, 생일(MMdd)이 오늘보다 뒤면 -1 */
const getAge = (b: Dayjs | null) => {
  if (!b) return '';
  const now = dayjs();
  let result = now.year() - b.year();
  if (Number(b.format('MMDD')) > Number(now.format('MMDD'))) result--;
  return String(result);
};

const MSG_CTZ = '주민등록번호를 형식에 맞게 입력하세요.';

/**
 * autodecCtzNo() L302-346: 주민번호('-' 뺀 13자리)로 생년월일·성별. 형식이 아니면 null
 * 뒤 첫 자리 1·2·5·6 → 19xx, 아니면 20xx / 1·3·5·7·9 → M "남", 아니면 F "여"
 */
const autodecCtzNo = (ctz?: string | null) => {
  if (ctz == null) return null;
  const v = ctz.replaceAll('-', '');
  if (v.length !== 13) return null;
  const g = v.substring(6, 7);
  const year = (['1', '2', '5', '6'].includes(g) ? '19' : '20') + v.substring(0, 2);
  const male = ['1', '3', '5', '7', '9'].includes(g);
  return { birthday: dayjs(`${year}-${v.substring(2, 4)}-${v.substring(4, 6)}`), genderCode: male ? 'M' : 'F', genderNm: male ? '남' : '여' };
};

/** AS-IS getEditor() L246-248: 칸 폭 350 / 550, 오른쪽 여백 50, 라벨 100 */
const Field: React.FC<{ label: string; width?: number; children?: React.ReactNode }> = ({ label, width = 350, children }) => (
  <Space.Compact style={{ width, flex: 'none', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 100, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1 }}>{children}</div>
  </Space.Compact>
);

/** row00~row06: HorizontalLayoutContainer, VerticalLayoutData 여백 20 */
const FormRow: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: 50, margin: '0 20px 20px' }}>{children}</div>
);

export const Emp02_TabPage_Others: React.FC<TransInfoTabProps> = ({ row, onRowChanged }) => {
  const [f, setF] = useState<Others | null>(null);
  const set = <K extends keyof Others>(k: K, v: Others[K]) => setF(prev => (prev ? { ...prev, [k]: v } : prev));
  const birthday = f?.birthday ? dayjs(f.birthday) : null;

  // retrieve(param) L350-355: 선택한 목록 행의 empOthersModel을 폼에 (TOBE는 사람 1명으로 읽는다) / init() L156-158: 비운다
  useEffect(() => {
    setF(null);
    if (!row) return;
    let alive = true;
    empApi.getOthers(row.personId)
      .then(o => { if (alive) setF(o); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    return () => { alive = false; };
  }, [row]);

  // [E4] updateButton[저장].Select (L130) → update(); autodecCtzNo(); update(); (L133-135)
  //   원본은 저장 전 목록 행의 주민번호로 계산하고 두 번 저장한다 — TOBE는 폼의 주민번호로 계산해 한 번 저장(결과 DB 값 같음, 작업방법 "저장")
  const update = async () => {
    if (!row || !f) return;
    const dec = autodecCtzNo(f.decCtzNo);
    if (!dec) message.warning(MSG_CTZ);
    const req: Others = dec ? { ...f, birthday: dec.birthday.format('YYYY-MM-DD'), genderCode: dec.genderCode } : f;
    try {
      // update() L160-186: 서비스 emp.Emp02_Others.updateOne → 폼과 목록 행(empOthersModel) 교체
      const saved = await empApi.updateOthers(req);
      setF(saved);
      onRowChanged?.({ ...row, birthday: saved.birthday, genderNm: dec ? dec.genderNm : row.genderNm }, row);
      message.success('저장되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const disabled = !f;
  const text = (k: keyof Others) => (
    <Input value={(f?.[k] as string | null | undefined) ?? ''} disabled={disabled} onChange={e => set(k, e.target.value)} />
  );
  // [E5]·[E6]·[E7]·[E8]·[E9] lunarName·genderName·nationName·militaryName·marriageName Collapse → 코드 칸에 코드 (L189-231): CodeSelect가 코드를 바로 준다
  const code = (k: keyof Others, kindCd: string, readOnly = false) => (
    <CodeSelect kindCd={kindCd} style={{ width: '100%' }} value={(f?.[k] as string | null | undefined) ?? undefined}
      disabled={disabled || readOnly} onChange={v => set(k, v ?? null)} />
  );

  // [E0] 화면 열림 (생성자 L95-153) → getEditor() L188-300. 나이·나이(만)·생년월일·성별은 읽기 전용(disable)
  return (
    <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* [E1 생략]·[E2 생략]·[E3 생략] image.Click → FileUpload(mode=emp01, image) → 사진 다시 읽기 — 파일 공통(B10) 뒤. 자리만 둔다 */}
        <div style={{ width: 245, height: 315, margin: 30, flex: 'none', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
          <UserOutlined style={{ fontSize: 80 }} />
        </div>
        <div style={{ paddingTop: 30 }}>
          <FormRow>
            <Field label="한자명">{text('chnName')}</Field>
            <Field label="성별">{code('genderCode', 'EmpGenderCode', true)}</Field>
            <Field label="우편번호">{text('zipCode')}</Field>
          </FormRow>
          <FormRow>
            <Field label="영문명">{text('engName')}</Field>
            <Field label="나이"><Input value={getKorAge(birthday)} placeholder="생년월일 미입력" disabled /></Field>
            <Field label="주소" width={550}>{text('zipAddress')}</Field>
          </FormRow>
          <FormRow>
            <Field label="주민번호">{text('decCtzNo')}</Field>
            <Field label="나이(만)"><Input value={getAge(birthday)} placeholder="생년월일 미입력" disabled /></Field>
            <Field label="상세" width={550}>{text('zipDetail')}</Field>
          </FormRow>
          <FormRow>
            <Field label="생년월일"><DatePicker style={{ width: '100%' }} value={birthday} format="YYYY-MM-DD" placeholder="0000-00-00" disabled /></Field>
            <Field label="병역구분">{code('militaryCode', 'EmpMilitaryCode')}</Field>
            <Field label="비고" width={550}>
              <Input.TextArea style={{ height: 150, resize: 'none' }} value={f?.note ?? ''} disabled={disabled} onChange={e => set('note', e.target.value)} />
            </Field>
          </FormRow>
          <FormRow>
            <Field label="음력구분">{code('lunarCode', 'EmpLunarCode')}</Field>
            <Field label="결혼여부">{code('marriageCode', 'EmpMaritalStatus')}</Field>
          </FormRow>
          <FormRow>
            <Field label="국적">{code('nationCode', 'EmpNationCode')}</Field>
            <Field label="자택전화">{text('homeTelNo')}</Field>
          </FormRow>
          <FormRow>
            <Field label="개인메일">{text('emailOther')}</Field>
            <Field label="가족사항">{text('familyDscr')}</Field>
          </FormRow>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        <Button type="save" onClick={update} disabled={disabled}>저장</Button>
      </div>
    </div>
  );
};
