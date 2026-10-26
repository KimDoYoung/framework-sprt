/**
 * 용역계약체결 등록·수정 창 (Q09) — Est02_Tab_PfContract의 [등록]·수정 아이콘에서 연다.
 * AS-IS: myApp/client/vi/est/Est02_Edit_PfContract.java (311줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L133-168: 모달 1400×650 "용역계쳬결"(원본 문구 그대로), 라벨 폭 130. 왼쪽 670 = 차주명 · 사업장명 · 사업장 주소지 · 용역(수수료)명(조회창 칸) · 수행시작일 230 · 수행종료일 230 · 담당자 230(조회창 칸) · 첨부파일(Est02_Grid_File),
 *   오른쪽 670 = 수행계획 편집기. 아래 가운데 [저장][닫기]
 * insert() L81-101: 새 번호(getSeq)를 받고 담당자 = 로그인 사용자, 수행시작일 = 오늘. edit(model, editChk) L103-131: 수행내역이 있으면(editChk false) 차주명~수행종료일·계획·첨부파일을 잠근다(담당자 칸은 그대로)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { PfContract } from '@/types/est';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Est01_Lookup_PfFeeType } from './Est01_Lookup_PfFeeType';
import { Est02_Grid_File } from './Est02_Grid_File';

const FORMAT = 'YYYY-MM-DD';

export type PfContractTarget =
  | { mode: 'insert' }
  /** editChk: 수행내역이 없어 고칠 수 있는가 (Est03_PfHistory.checkList 결과가 비었는가) */
  | { mode: 'edit'; row: PfContract; editChk: boolean };

interface Props {
  target: PfContractTarget | null;
  /** callback.execute() — 저장이 끝난 뒤(창은 스스로 닫는다) */
  onSaved: () => void;
  onClose: () => void;
}

const Field: React.FC<{ label: string; width?: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width: width ?? '100%' }}>
    <Typography.Text style={{ width: 130, flex: 'none', lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Form {
  pfContractId: number | null;
  borrower: string;
  projectSiteName: string;
  projectSiteAddr: string;
  pfFeeTypeId: number | null;
  feeName: string;
  startDate: Dayjs | null;
  closeDate: Dayjs | null;
  managerId: number | null;
  managerName: string;
  plan: string;
}

const emptyForm = (): Form => ({ pfContractId: null, borrower: '', projectSiteName: '', projectSiteAddr: '', pfFeeTypeId: null, feeName: '',
  startDate: dayjs(), closeDate: null, managerId: null, managerName: '', plan: '' });

export const Est02_Edit_PfContract: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  const [f, setF] = useState<Form>(emptyForm());
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feeLookup, setFeeLookup] = useState(false);
  const [empLookup, setEmpLookup] = useState(false);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => ({ ...prev, [k]: v }));

  // [E0] 화면 열림 (생성자 L133-168) → settings(), getEditor(). insert() L81-101 / edit() L103-131
  useEffect(() => {
    if (!target) { setReady(false); return; }
    setReady(false);
    if (target.mode === 'insert') {
      // 새 번호(dbUtil.setSeq) → 담당자 = 로그인 사용자, 수행시작일 = 오늘
      void (async () => {
        try {
          const id = await estApi.nextPfContractId();
          setF({ ...emptyForm(), pfContractId: id, managerId: user.userId, managerName: user.name });
          setReady(true);
        } catch (err) {
          message.error(errorMessage(err, '조회 실패'));
          onClose();
        }
      })();
    } else {
      const r = target.row;
      setF({ pfContractId: r.pfContractId, borrower: r.borrower ?? '', projectSiteName: r.projectSiteName ?? '', projectSiteAddr: r.projectSiteAddr ?? '',
        pfFeeTypeId: r.pfFeeTypeId, feeName: r.feeName ?? '', startDate: r.startDate ? dayjs(r.startDate) : null, closeDate: r.closeDate ? dayjs(r.closeDate) : null,
        managerId: r.managerId, managerName: r.managerName ?? '', plan: r.plan ?? '' });
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target) return null;
  // edit(model, editChk) L106-115: 수행내역이 있으면 차주명~수행종료일·계획·첨부파일을 잠근다
  const locked = target.mode === 'edit' && !target.editChk;

  // [E3] updateButton[저장].Select (L203) → update() L217-259
  const update = async () => {
    const blank = (v: string) => v.trim() === '';
    const warn = (msg: string) => { message.warning(msg); };
    if (blank(f.borrower)) return warn('차주명은 필수입력 항목입니다');
    if (blank(f.projectSiteName)) return warn('사업장명은 필수입력 항목입니다');
    if (blank(f.projectSiteAddr)) return warn('사업장 주소지는 필수입력 항목입니다');
    if (!f.startDate) return warn('수행시작일은 필수선택 항목입니다');
    if (!f.closeDate) return warn('수행종료일은 필수선택 항목입니다');
    if (f.pfContractId == null || f.managerId == null) return;
    setSaving(true);
    try {
      await estApi.savePfContract({
        pfContractId: f.pfContractId, borrower: f.borrower, projectSiteName: f.projectSiteName, projectSiteAddr: f.projectSiteAddr,
        pfFeeTypeId: f.pfFeeTypeId, startDate: f.startDate.format(FORMAT), closeDate: f.closeDate.format(FORMAT), managerId: f.managerId,
        plan: f.plan === '' ? null : f.plan,
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <LookupModal
        open
        title="용역계쳬결"
        width={1400}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update} loading={saving}>저장</Button>
              {/* [E4] closeButton[닫기].Select (L209) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {ready && (
          <div style={{ display: 'flex', gap: 20, height: 470 }}>
            <div style={{ width: 670, flex: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 5 }}>
              <Field label="차주명 "><Input disabled={locked} value={f.borrower} onChange={e => set('borrower', e.target.value)} /></Field>
              <Field label="사업장명 "><Input disabled={locked} value={f.projectSiteName} onChange={e => set('projectSiteName', e.target.value)} /></Field>
              <Field label="사업장 주소지 "><Input disabled={locked} value={f.projectSiteAddr} onChange={e => set('projectSiteAddr', e.target.value)} /></Field>
              <Field label="용역(수수료)명 ">
                {/* [E1] feeName.TriggerClick (L172) → Est01_Lookup_PfFeeType.open → 용역(수수료)명·pfFeeTypeId */}
                <LookupInput value={f.feeName} width={540} disabled={locked} onOpen={() => setFeeLookup(true)} />
              </Field>
              <Field label="수행시작일 " width={360}>
                <DatePicker style={{ width: 230 }} format={FORMAT} disabled={locked} value={f.startDate} onChange={d => set('startDate', d)} />
              </Field>
              <Field label="수행종료일 " width={360}>
                <DatePicker style={{ width: 230 }} format={FORMAT} disabled={locked} value={f.closeDate} onChange={d => set('closeDate', d)} />
              </Field>
              <Field label="담당자 ">
                {/* [E2] managerName[담당자].TriggerClick (L188) → Emp00_Lookup_SelectSingle.open(오늘) → 성명·personId */}
                <LookupInput value={f.managerName} width={230} onOpen={() => setEmpLookup(true)} />
              </Field>
              <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
                <Typography.Text style={{ width: 130, flex: 'none', lineHeight: '32px' }}>첨부파일 </Typography.Text>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Est02_Grid_File parentId={f.pfContractId} editable={!locked} />
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 5 }}>
              <Typography.Text style={{ lineHeight: '32px' }}>수행계획</Typography.Text>
              {/* getEditor() L263-275: 편집기는 만들 때 한 번만 값을 넣는다 → 열릴 때마다 key로 새로. 잠그면(cp.setEnabled(false)) 눌러도 안 바뀐다 */}
              <div style={locked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                <HtmlEditor key={f.pfContractId ?? 'new'} value={f.plan} onChange={html => set('plan', html)} height={420} />
              </div>
            </div>
          </div>
        )}
      </LookupModal>
      <Est01_Lookup_PfFeeType
        open={feeLookup}
        onResult={row => setF(prev => ({ ...prev, feeName: row.feeName ?? '', pfFeeTypeId: row.pfFeeTypeId }))}
        onClose={() => setFeeLookup(false)}
      />
      <Emp00_Lookup_SelectSingle
        open={empLookup}
        transDate={dayjs().format(FORMAT)}
        noneLabel={null}
        onResult={row => { if (row) setF(prev => ({ ...prev, managerName: row.korNm ?? '', managerId: row.personId })); }}
        onClose={() => setEmpLookup(false)}
      />
    </>
  );
};
