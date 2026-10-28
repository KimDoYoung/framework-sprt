/**
 * 증명서 발급 창의 공통 폼 (S05) — Emp15_Lookup_Cert(직접 발급)와 Emp15_Lookup_StampDocCert(신청내역 가져오기)가 같이 쓴다
 * AS-IS: myApp/client/vi/emp/Emp15_Lookup_Cert.java L95-381, Emp15_Lookup_StampDocCert.java L98-502 — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 Emp15_Lookup_Cert 기준)
 * getEditor() L127-202: 라벨 폭 110, 증명서종류 · 사원 · 용도(+직접입력 칸) · 문서분류(600), 아래 가운데 [상신][닫기]
 * 1단계: [상신]은 증명서 저장(modelUpdate)까지. createMapping() + Apr01_Edit_ApprDoc.insertLinkApproval(결재 문서 작성) + updateApprId()는 다음 단계
 */
import React, { useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { empCertApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';

/** 처음 채워 넣는 값 (StampDocCert.insert L98-149: 신청 구분으로 정한 증명서종류·신청 사원) */
export interface CertPreset {
  linkCode?: string;
  personId?: number;
  personName?: string;
}

interface Props {
  width: number;
  preset?: CertPreset;
  /** 오른쪽에 붙는 영역(StampDocCert의 신청 내용) — 있으면 폼은 650 폭 */
  side?: React.ReactNode;
  /** [상신] 저장이 끝난 뒤 (AS-IS callBack.execute()) — 부르는 쪽이 다시 조회한다 */
  onSaved: () => void;
  onClose: () => void;
}

/** 라벨 폭 110 (form.setLabelWidth(110)), 라벨 오른쪽 정렬 */
const Field: React.FC<{ label: string; width: number | string; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: 110, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Emp15_CertEdit: React.FC<Props> = ({ width, preset, side, onSaved, onClose }) => {
  const [linkCode, setLinkCode] = useState<string | undefined>(preset?.linkCode);
  const [personId, setPersonId] = useState<number | undefined>(preset?.personId);
  const [personName, setPersonName] = useState(preset?.personName ?? '');
  const [certUseCode, setCertUseCode] = useState<string | undefined>();
  const [certUseName, setCertUseName] = useState<string | undefined>();
  const [certUse, setCertUse] = useState('');
  const [classTree, setClassTree] = useState<{ id: number; name: string } | null>(null);
  /** defaultModel: 마지막으로 Link 코드에서 찾은 문서분류 — 문서분류 선택 창이 권한 없이도 고르게 하는 기준 */
  const [defaultTreeId, setDefaultTreeId] = useState<number | null>(null);
  const [empOpen, setEmpOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L95-125, insert() L81-93) → show(): 발급일 = 오늘, 나머지는 빈 값
  // searchDcr() L274-297: 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) — 없으면 문서분류를 비우고, 있으면 (마지막) 문서분류로 채운다
  const searchDcr = async (code: string | undefined) => {
    if (!code) return;
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(code);
      if (list.length === 0) {
        setClassTree(null);
        return;
      }
      const m = list[list.length - 1];
      setDefaultTreeId(m.classTreeId);
      setClassTree({ id: m.classTreeId, name: m.classTreeFullName });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // StampDocCert.insert L98-149 마지막: 증명서종류가 정해져 열리면 searchDcr()
  React.useEffect(() => { if (preset?.linkCode) searchDcr(preset.linkCode); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] updateButton[상신].Select (L108) → update() L204-248
  const update = async () => {
    if (!linkCode) return message.warning('증명서종류를 지정해주세요');
    if (personId == null) return message.warning('사원을 지정해주세요');
    if (!certUseCode) return message.warning('용도를 지정해주세요');
    if (!classTree) return message.warning('문서분류를 지정해주세요');
    setSaving(true);
    try {
      // 서비스 emp.Emp15_Cert.modelUpdate(updateModel) — 발급일 = 오늘(insert L81-93)
      await empCertApi.createCert({
        issueDate: dayjs().format('YYYY-MM-DD'), linkCode, personId, certUseCode, certUse: certUse === '' ? null : certUse, dcrClassTreeId: classTree.id,
      });
      // createMapping(resultModel) + Apr01_Edit_ApprDoc.insertLinkApproval(…) → updateApprId(apprId, certId): 결재 문서 작성은 다음 단계
      message.info('증명서를 저장했습니다. 전자결재 상신(Apr01_Edit_ApprDoc)은 아직 변환 전입니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const formWidth = side ? 650 : '100%';
  return (
    <Modal
      open
      title="증명서 발급"
      width={width}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="register" onClick={update} loading={saving}>상신</Button>
            {/* [E2] closeButton[닫기].Select (L114) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '12px 2px', width: formWidth, flex: side ? 'none' : 1, boxSizing: 'border-box' }}>
          <Field label="증명서종류" width={300}>
            {/* [E3] linkName.Collapse (L129) → linkCode = 고른 코드 / [E4] linkName.ValueChange (L135) → searchDcr() */}
            <SystemCodeComboBox kindGroupCd="LinkCode0003" applyDate={dayjs().format('YYYY-MM-DD')} placeholder="선택" style={{ width: '100%' }}
              value={linkCode} onChange={code => { setLinkCode(code); searchDcr(code); }} />
          </Field>
          <Field label="사원" width={300}>
            {/* [E7] personName[사원].TriggerClick (L160) → openLookupEmpInfo() L250-260 */}
            <LookupInput width={300} value={personName} onOpen={() => setEmpOpen(true)} />
          </Field>
          <Space size={0} align="start">
            <Field label="용도" width={410}>
              {/* [E5] certUseName[용도].Collapse (L142) → certUseCode / [E6] certUseName[용도].ValueChange (L148) → "직접입력"이면 용도 칸 사용 */}
              <SystemCodeComboBox kindCd="CertUseCode" placeholder="선택" style={{ width: 300 }}
                value={certUseCode} onChange={(code, name) => { setCertUseCode(code); setCertUseName(name); }} />
            </Field>
            <Input style={{ width: 300 }} disabled={certUseName !== '직접입력'} value={certUse} onChange={e => setCertUse(e.target.value)} />
          </Space>
          <Field label="문서분류" width={side ? 620 : 600}>
            {/* [E8] dcrClassTreeName[문서분류].TriggerClick (L168) → openLookupDoc() L262-272 */}
            <LookupInput width={side ? 500 : 480} value={classTree?.name ?? ''} placeholder="선택" onOpen={() => setDocOpen(true)} />
          </Field>
        </div>
        {side && <div style={{ flex: 1, minWidth: 0, padding: '12px 0' }}>{side}</div>}
      </div>
      {/* openLookupEmpInfo(): Emp00_Lookup_SelectSingle.open(오늘, callback) — 널 단추 없음 */}
      <Emp00_Lookup_SelectSingle open={empOpen} noneLabel={null} transDate={dayjs().format('YYYY-MM-DD')}
        onResult={row => { if (row) { setPersonId(row.personId); setPersonName(row.korNm ?? ''); } setEmpOpen(false); }}
        onClose={() => setEmpOpen(false)} />
      {/* openLookupDoc(): Dcr30_Move_DcrClass.open(defaultModel, callback) — 일반 사용자 열기(권한 검사) */}
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultTreeId}
        onResult={r => { if (r.classTreeId != null) setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' }); setDocOpen(false); }}
        onClose={() => setDocOpen(false)} />
    </Modal>
  );
};
