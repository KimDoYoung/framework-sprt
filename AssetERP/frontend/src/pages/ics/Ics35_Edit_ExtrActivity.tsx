/**
 * 대외활동신청 등록·수정 창 (M01) — Ics35_Tab_ExtrActivity의 [등록] 버튼·수정 아이콘이 연다
 * AS-IS: myApp/client/vi/ics/Ics35_Edit_ExtrActivity.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L96-109·getEditor() L153-203: 모달 800×650, 라벨 100, 신청일자 / 활동처 / 활동대상(콤보 330 + 직접기재 430) / 활동기간 / 활동내용(100) / 활동보수 / 첨부자료([파일업로드]) / 첨부 그리드(190),
 *   아래 가운데 [저장][닫기]
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Space } from 'antd';
import dayjs from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsExtrActivity } from '@/types/ics';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Ics35_Grid_FileList, Ics35_Grid_FileListHandle } from './Ics35_Grid_FileList';

const LABEL_W = 100;

/** 라벨(폭 100) + 칸 한 줄 (AS-IS FieldLabel) — width는 라벨을 뺀 칸 폭 */
const Field: React.FC<{ label: React.ReactNode; children: React.ReactNode; width: number; bottom?: number }> = ({ label, children, width, bottom = 16 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: bottom }}>
    <div style={{ width: LABEL_W, flex: 'none', lineHeight: '32px', fontWeight: 'bold', color: '#1F4D83' }}>{label}</div>
    <div style={{ width }}>{children}</div>
  </div>
);

export type Ics35_Edit_ExtrActivityTarget = { mode: 'insert' } | { mode: 'edit'; row: IcsExtrActivity };

interface Props {
  /** insert(callback) L61-79 / edit(model, callback) L81-94 — 값이 있으면 열린다 */
  target: Ics35_Edit_ExtrActivityTarget | null;
  /** 저장 끝 (AS-IS callback.execute() → 위 화면이 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

export const Ics35_Edit_ExtrActivity: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [extrActivityId, setExtrActivityId] = useState<number | null>(null);
  const [regDate, setRegDate] = useState<string | null>(null);
  const [activityCorp, setActivityCorp] = useState('');
  const [activityTgtCd, setActivityTgtCd] = useState<string | undefined>(undefined);
  const [activityTgtEtc, setActivityTgtEtc] = useState('');
  const [activityPeriod, setActivityPeriod] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityPay, setActivityPay] = useState('');
  const fileList = useRef<Ics35_Grid_FileListHandle>(null);
  const open = target != null;
  const etcEnabled = activityTgtCd === '90';

  // [E0] 화면 열림 (생성자 L96-109) → settings(), getEditor(), show()
  // insert() L61-79: 회사·사원·신청일(오늘)을 채우고 DBUtil.setSeq로 새 ID를 받아 편집 칸에 넣는다. edit() L81-94: 고른 행을 편집 칸에 넣고, 활동대상이 90(기타)일 때만 직접기재를 켠다
  useEffect(() => {
    if (!target) return;
    let alive = true;
    if (target.mode === 'insert') {
      setRegDate(dayjs().format('YYYY-MM-DD'));
      setActivityCorp(''); setActivityTgtCd(undefined); setActivityTgtEtc('');
      setActivityPeriod(''); setActivityDesc(''); setActivityPay('');
      setExtrActivityId(null);
      icsApi.getExtrActivityNextId()
        .then(id => { if (alive) setExtrActivityId(id); })
        .catch(err => message.error(errorMessage(err, '조회 실패')));
    } else {
      const r = target.row;
      setExtrActivityId(r.extrActivityId);
      setRegDate(r.regDate);
      setActivityCorp(r.activityCorp ?? '');
      setActivityTgtCd(r.activityTgtCd ?? undefined);
      setActivityTgtEtc(r.activityTgtCd === '90' ? (r.activityTgtEtc ?? '') : '');
      setActivityPeriod(r.activityPeriod ?? '');
      setActivityDesc(r.activityDesc ?? '');
      setActivityPay(r.activityPay ?? '');
    }
    return () => { alive = false; };
  }, [target]);

  // [E3] updateButton[저장].Select (L139) → update() L205-240: 필수 항목 검사 순서대로 안내, ics.Ics35_ExtrActivity.modelUpdate → callback.execute(), hide()
  const update = async () => {
    if (extrActivityId == null) return;
    if (!regDate) { message.warning('신청일자는 필수선택항목입니다.'); return; }
    if (!activityCorp) { message.warning('활동처는 필수입력항목입니다.'); return; }
    if (!activityTgtCd) { message.warning('활동대상은 필수선택항목입니다.'); return; }
    if (!activityPeriod) { message.warning('활동기간은 필수입력항목입니다.'); return; }
    if (!activityDesc) { message.warning('활동내용은 필수입력항목입니다.'); return; }
    try {
      await icsApi.saveExtrActivity({
        extrActivityId, regDate, activityCorp, activityTgtCd,
        activityTgtEtc: etcEnabled && activityTgtEtc ? activityTgtEtc : null,
        activityPeriod, activityDesc, activityPay: activityPay || null,
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title={target?.mode === 'edit' ? '대외활동신청 수정' : '대외활동신청 등록'}
      width={800}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] updateButton[저장].Select (L139) → update(), [E4] closeButton[닫기].Select (L145) → hide() */}
            <Button type="save" onClick={update}>저장</Button>
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 0 0' }}>
        <Field label="신청일자" width={160}>
          <DatePicker style={{ width: 140 }} allowClear={false} value={regDate ? dayjs(regDate) : null}
            onChange={d => setRegDate(d ? d.format('YYYY-MM-DD') : null)} />
        </Field>
        <Field label="활동처" width={660}>
          <Input value={activityCorp} onChange={e => setActivityCorp(e.target.value)} />
        </Field>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: LABEL_W, flex: 'none', lineHeight: '32px', fontWeight: 'bold', color: '#1F4D83' }}>활동대상</div>
          {/* [E1] activityTgtName[활동대상].Collapse (L121) → 90(기타)이면 직접기재 칸을 켜고 아니면 비운 뒤 끄고, activityTgtCode = 고른 코드 */}
          <SystemCodeComboBox kindCd="ExtrActivityTargetCode" placeholder="선택" style={{ width: 230 }} value={activityTgtCd}
            onChange={code => { setActivityTgtCd(code); if (code !== '90') setActivityTgtEtc(''); }} />
          <Input style={{ width: 430, marginLeft: 10 }} placeholder="기타인 경우 직접기재" disabled={!etcEnabled} value={activityTgtEtc}
            onChange={e => setActivityTgtEtc(e.target.value)} />
        </div>
        <Field label="활동기간" width={660}>
          <Input placeholder="예) 2025-07-01 10:30 ~ 2025-07-02 17:30" value={activityPeriod} onChange={e => setActivityPeriod(e.target.value)} />
        </Field>
        <Field label="활동내용" width={660} bottom={10}>
          <Input.TextArea style={{ height: 100, resize: 'none' }} value={activityDesc} onChange={e => setActivityDesc(e.target.value)}
            placeholder={'* 다른 법인 임원 취임인 경우 해당 회사명, 직위, 주요 활동내용 등을 기재\n* 강연 등의 경우 강연 주관자, 대상자, 강연주제 등 구체적인 내용을 기재\n* 대외활동 타당성 검토에 필요한 자료를 제출(원고, 강의록 등)'} />
        </Field>
        <Field label="활동보수" width={660}>
          <Input placeholder="예) 시간, 편, 회당 000원 등" value={activityPay} onChange={e => setActivityPay(e.target.value)} />
        </Field>
        <Field label="첨부자료" width={160} bottom={10}>
          {/* [E2] uploadButton[첨부자료].Select (L133) → fileList.upload() */}
          <Button type="upload" disabled={extrActivityId == null} onClick={() => fileList.current?.upload()}>파일업로드</Button>
        </Field>
        <div style={{ height: 190, marginLeft: LABEL_W + 15, width: 645 }}>
          <Ics35_Grid_FileList ref={fileList} parentId={open ? extrActivityId : null} />
        </div>
      </div>
    </LookupModal>
  );
};
