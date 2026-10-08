/**
 * 기본정보 탭 (C01) — Emp00_Tab_TransInfo 아래 탭 1번째.
 * AS-IS: myApp/client/vi/emp/Emp01_TabPage_Person.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 사원의 emp01_person을 폼으로 보여 주고 저장·삭제한다. 사진(E3~E5)·입사일 팝업(E9)은 2단계.
 */
import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Input, message, Modal, Row, Space, Typography } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { useLoginUser } from '@/hooks/useLoginUser';
import type { TransInfoTabProps } from './Emp00_Tab_TransInfo';

interface EditForm {
  empNo: string;
  korNm: string;
  hireDate: Dayjs | null;
  hireCd?: string;
  applyCd?: string;
  orderSeq: string;
  emailAddr: string;
  officeTelNo: string;
  officeDetail: string;
  mobileTelNo: string;
  note: string;
}

const EMPTY: EditForm = { empNo: '', korNm: '', hireDate: null, orderSeq: '', emailAddr: '', officeTelNo: '', officeDetail: '', mobileTelNo: '', note: '' };

const toForm = (r: TransInfo): EditForm => ({
  empNo: r.empNo ?? '', korNm: r.korNm ?? '', hireDate: r.hireDate ? dayjs(r.hireDate) : null,
  hireCd: r.hireCd ?? undefined, applyCd: r.applyCd ?? undefined, orderSeq: r.orderSeq ?? '', emailAddr: r.emailAddr ?? '',
  officeTelNo: r.officeTelNo ?? '', officeDetail: r.officeDetail ?? '', mobileTelNo: r.mobileTelNo ?? '', note: r.note ?? '',
});

/** AS-IS Emp01_PersonModel.getThYear(): 올해 - 입사년 + 1 "년차" */
const getThYear = (hire: Dayjs | null) => (hire ? `${dayjs().year() - hire.year() + 1}년차` : '입사일 미입력');

/** AS-IS Emp01_PersonModel.getWorkYear(): 년·월 차이 (일은 보지 않음) */
const getWorkYear = (hire: Dayjs | null) => {
  if (!hire) return '입사일 미입력';
  const now = dayjs();
  let years = now.year() - hire.year();
  let months = now.month() - hire.month();
  if (months < 0) { months += 12; years -= 1; }
  return years <= 0 ? `${months}개월` : `${years}년 ${months}개월`;
};

/** AS-IS getEditor() L284-352: 칸 폭 350(라벨 100) */
const Field: React.FC<{ label?: string; children?: React.ReactNode }> = ({ label, children }) => (
  <Space.Compact block style={{ alignItems: 'center', height: 32 }}>
    <Typography.Text style={{ width: 100, flex: 'none' }}>{label}</Typography.Text>
    <div style={{ flex: 1 }}>{children}</div>
  </Space.Compact>
);

export const Emp01_TabPage_Person: React.FC<TransInfoTabProps> = ({ row, onRowChanged, onRowDeleted }) => {
  const user = useLoginUser();
  const [f, setF] = useState<EditForm>(EMPTY);
  const set = <K extends keyof EditForm>(k: K, v: EditForm[K]) => setF(prev => ({ ...prev, [k]: v }));

  // retrieve(param) L355-360: 선택한 목록 행의 사람 정보를 폼에 / init() L180-182: 비운다
  useEffect(() => { setF(row ? toForm(row) : EMPTY); }, [row]);

  // [E6] updateButton[저장].Select (L165) → update() L184-206: 서비스 emp.Emp01_Person.update → 목록 행의 사람 정보 교체
  const update = async () => {
    if (!row) return;
    const req = {
      empNo: f.empNo, korNm: f.korNm, hireDate: f.hireDate?.format('YYYY-MM-DD') ?? null, hireCd: f.hireCd ?? null, applyCd: f.applyCd ?? null,
      orderSeq: f.orderSeq || null, emailAddr: f.emailAddr || null, officeTelNo: f.officeTelNo || null,
      officeDetail: f.officeDetail || null, mobileTelNo: f.mobileTelNo || null, note: f.note || null,
    };
    try {
      await empApi.updatePerson(row.personId, req);
      onRowChanged?.({ ...row, ...req }, row);
      message.success('저장되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L171) → deleteConfirm() L208-239
  const deleteConfirm = async () => {
    if (!row) return;
    try {
      // 서비스 emp.Emp04_AddTitle.selectByPersonId(personId = LoginUser.getUserId()) — 원본 그대로 로그인 사용자 ID로 본다(작업기록 "제안")
      if ((await empApi.countAddTitles(user.userId)) > 0) {
        message.warning('겸직발령내역이 존재합니다. 삭제 후 처리해주세요');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '확인',
      width: 480,
      content: (
        <span>
          선택한 사원의 정보를 삭제하면 예전 데이터도 전부 삭제됩니다.<br />진행하시겠습니까?{' '}
          <b style={{ color: '#CE4242' }}>[ 퇴직처리는 '일반발령' 탭에서 가능합니다 ]</b>
        </span>
      ),
      okText: '진행',
      cancelText: '취소',
      // [E8] messageBox.DialogHide [YES] (L225) → delete()
      onOk: remove,
    });
  };

  // delete() L259-282: 서비스 emp.Emp01_Person.deleteTarget(personId, empId) → init() + 목록에서 뺀다
  const remove = async () => {
    if (!row) return;
    try {
      await empApi.deletePerson(row.personId);
      setF(EMPTY);
      onRowDeleted?.(row);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L100-117) → settings(), getEditor(). 사번은 읽기 전용, 년차·근속년수는 표시만
  // [E1]·[E2] hireName[채용구분]·applyName[지원경로] Collapse → 코드 저장 (L124-135): CodeSelect가 코드를 바로 준다
  return (
    <div style={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 30, padding: '20px 30px', flex: 1 }}>
        {/* [E3]~[E5 생략] 사진(245×315) 클릭·업로드 — 2단계(파일 B10). 자리만 둔다 */}
        <div style={{ width: 245, height: 315, flex: 'none', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
          <UserOutlined style={{ fontSize: 80 }} />
        </div>
        <Row gutter={30} wrap={false} style={{ flex: 1, alignItems: 'flex-start' }}>
          <Col flex="350px">
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Field label="사원번호"><Input value={f.empNo} readOnly /></Field>
              <Field label="출력순서"><Input value={f.orderSeq} placeholder="미입력시 자동정렬" onChange={e => set('orderSeq', e.target.value)} /></Field>
              <Field label="한글명"><Input value={f.korNm} onChange={e => set('korNm', e.target.value)} /></Field>
              <Field label="채용구분"><CodeSelect kindCd="HireCode" style={{ width: '100%' }} value={f.hireCd} onChange={v => set('hireCd', v)} /></Field>
              <Field label="지원경로"><CodeSelect kindCd="EmpApplyCode" style={{ width: '100%' }} value={f.applyCd} onChange={v => set('applyCd', v)} /></Field>
            </Space>
          </Col>
          <Col flex="350px">
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Field label="입사일">
                <Space.Compact block>
                  <DatePicker style={{ width: '100%' }} value={f.hireDate} onChange={d => set('hireDate', d)} format="YYYY-MM-DD" />
                  {/* [E9 생략] anchorHire.MouseDown (L287) → Emp02_Lookup_HireDate — 2단계 */}
                  <Button icon={<EditOutlined />} disabled title="그룹입사일·연차기준입사일 (2단계)" />
                </Space.Compact>
              </Field>
              <Field label="이메일"><Input value={f.emailAddr} onChange={e => set('emailAddr', e.target.value)} /></Field>
              <Field label="회사전화"><Input value={f.officeTelNo} onChange={e => set('officeTelNo', e.target.value)} /></Field>
              <Field label="내선번호"><Input value={f.officeDetail} onChange={e => set('officeDetail', e.target.value)} /></Field>
              <Field label="휴대폰"><Input value={f.mobileTelNo} onChange={e => set('mobileTelNo', e.target.value)} /></Field>
              <Field label="년차"><Input value={row ? getThYear(f.hireDate) : ''} disabled /></Field>
              <Field label="근속년수"><Input value={row ? getWorkYear(f.hireDate) : ''} disabled /></Field>
            </Space>
          </Col>
          <Col flex="350px">
            <Space.Compact block style={{ alignItems: 'flex-start' }}>
              <Typography.Text style={{ width: 100, flex: 'none' }}>특이사항</Typography.Text>
              <Input.TextArea style={{ height: 270, resize: 'none' }} value={f.note} onChange={e => set('note', e.target.value)} />
            </Space.Compact>
          </Col>
        </Row>
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        <Space>
          <Button type="save" onClick={update} disabled={!row}>저장</Button>
          <Button type="delete" onClick={deleteConfirm} disabled={!row}>삭제</Button>
        </Space>
      </div>
    </div>
  );
};
