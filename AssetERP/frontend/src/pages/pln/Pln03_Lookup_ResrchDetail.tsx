/**
 * 리서치 일정등록 창 (EE90) — AS-IS는 기획 리서치 탭 Pln03_Tab_Resrch의 [등록]·상세보기 아이콘이 연다 (TOBE에 Pln 화면이 없어 연결 안 함)
 * AS-IS: myApp/client/vi/pln/Pln03_Lookup_ResrchDetail.java (683줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(resrchId, callback) L98-124: 840×680 모달 "리서치 일정등록", getEditor() L428-595:
 *   등록자(읽기 전용 200) · 조사기간 [시작]~[종료] / 문서구분(읽기 전용 200)[찾기] · 조사대상(콤보 ResrchTargetTypeCode 105) 대상명(읽기 전용 160)[찾기] /
 *   개요(편집기) / 비고(700) / 첨부파일(`Sys10_Lookup_SelectMulti` 패널 120) / 확인자(읽기 전용 200)[찾기] · 확인완료일자(읽기 전용)
 *   아래 가운데 [저장][승인요청|요청취소][승인][닫기]
 * retrieve() L126-146: 새 건(resrchId 없음)은 pln.Pln03_Resrch.selectDetailInit, 있으면 selectById
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { plnResrchApi } from '@/api/pln';
import { errorMessage } from '@/api/client';
import { PlnResrch } from '@/types/pln';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Fnd07_Lookup_IssuingEntity } from '@/components/lookup/Fnd07_Lookup_IssuingEntity';
import { Sys09_Lookup_CodeOpen } from '@/components/lookup/Sys09_Lookup_CodeOpen';
import { Sys10_Lookup_SelectMulti } from '@/components/lookup/Sys10_Lookup_SelectMulti';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Dcr01_Lookup_ClassTree } from '../dcr/Dcr01_Lookup_ClassTree';

const LABEL: React.CSSProperties = { width: 90, flex: 'none', textAlign: 'right', paddingRight: 8, fontSize: 12 };

interface Props {
  open: boolean;
  /** open(resrchId, …)의 resrchId — 없으면 새 건 */
  resrchId?: number | null;
  /** callback.execute(…) — [저장] 뒤·[닫기] (부른 쪽이 목록을 다시 읽는다) */
  onChanged: () => void;
  onClose: () => void;
}

export const Pln03_Lookup_ResrchDetail: React.FC<Props> = ({ open, resrchId, onChanged, onClose }) => {
  const user = useLoginUser();
  const [m, setM] = useState<PlnResrch | null>(null);
  const [nonce, setNonce] = useState(0);
  const [classOpen, setClassOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const set = (p: Partial<PlnResrch>) => setM(prev => (prev ? { ...prev, ...p } : prev));

  // [E0] 열림 → retrieve() L126-146 → getServiceResult("retrieve") L313-338 · setEnabled() L369-399
  useEffect(() => {
    if (!open) { setM(null); return; }
    const run = async () => {
      try {
        const r = resrchId == null ? await plnResrchApi.init() : await plnResrchApi.get(resrchId);
        setM(r);
        setNonce(n => n + 1);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        onClose();
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resrchId]);

  const isReg = m?.regPersonId === user.userId;
  // setEnabled() L370-385: 등록자이면서 승인 전이면 편집 가능
  const editable = isReg && m?.cfrmDate == null;
  const issuingVisible = m?.targetTypeCode !== '30';
  // apprButtonEnabled() L401-416
  const apprEnabled = isReg && m?.cfrmDate == null;
  // okButtonEnabled() L418-426
  const okEnabled = m?.cfrmPersonId === user.userId && m?.cfrmDate == null && m?.closeDate != null;

  // [E7] updateButton[저장].Select (L600) → update() L148-157 → preUpdate() L159-200
  const update = async () => {
    if (!m) return;
    if (!m.resrchStartDate) { message.warning('조사시작일자를 선택하여 주십시오'); return; }
    if (!m.resrchCloseDate) { message.warning('조사종료일자를 선택하여 주십시오'); return; }
    if (m.classTreeId == null) { message.warning('문서구분을 선택하여 주십시오'); return; }
    if (!m.targetTypeCode) { message.warning('조사대상구분을 선택하여 조십시오'); return; }
    if (m.targetTypeCode !== '30' && m.issuingEntityId == null) { message.warning('조사대상을 선택하여 주십시오'); return; }
    if (m.cfrmPersonId == null) { message.warning('확인자를 선택하여 주십시오'); return; }
    try {
      await plnResrchApi.save({
        resrchId: m.resrchId, classTreeId: m.classTreeId ?? null, issuingEntityId: m.issuingEntityId ?? null, visitReason: m.visitReason || null,
        resrchStartDate: m.resrchStartDate ?? null, resrchCloseDate: m.resrchCloseDate ?? null, cfrmPersonId: m.cfrmPersonId ?? null,
        note: m.note || null, targetTypeCode: m.targetTypeCode ?? null,
      });
      onChanged();   // getServiceResult("update") L340-343: callback.execute(null), hide()
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E8] apprButton[승인요청].Select (L609) → appr_check() L202-239 → [E1] 확인창 YES → appr() L273-289
  const apprCheck = () => {
    if (!m) return;
    if (!isReg) { message.warning('권한이 없습니다'); return; }
    const cancel = m.closeDate != null;
    Modal.confirm({
      title: '확인',
      content: cancel ? '요청취소를 하시겠습니까?' : '승인요청을 하시겠습니까?',
      okText: '예', cancelText: '아니오', width: 300,
      onOk: async () => {
        try {
          await plnResrchApi.close(m.resrchId, !cancel);
          set(cancel ? { closeDate: null, closeYn: 'false' } : { closeDate: dayjs().format('YYYY-MM-DD'), closeYn: 'true' });
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // [E9] okButton[승인].Select (L619) → confirm_check() L241-271 → [E2] 확인창 YES → confirm() L292-308
  const confirmCheck = () => {
    if (!m) return;
    if (m.cfrmPersonId !== user.userId) { message.warning('권한이 없습니다'); return; }
    if (m.cfrmDate != null) return;
    Modal.confirm({
      title: '확인',
      content: '승인처리를 하시겠습니까?',
      okText: '예', cancelText: '아니오', width: 300,
      onOk: async () => {
        try {
          await plnResrchApi.confirm(m.resrchId);
          set({ cfrmDate: dayjs().format('YYYY-MM-DD') });   // getServiceResult("confirm") L354-365: 확인완료일자 채움, [승인] 막음
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  // [E10] cancelButton[닫기].Select (L629) → callback(this), hide()
  const close = () => { onChanged(); onClose(); };

  // [E4] targetTypeName[ResrchTargetTypeCode].Collapse (L491): 대상 칸 표시(30이면 숨김), 코드 반영, 조사대상 지움
  const onTargetType = (code?: string) => set({ targetTypeCode: code ?? null, issuingEntityId: null, issuingEntityName: null });

  // [E5] issuingEntitySearch[찾기].Select (L511)
  const findTarget = () => {
    if (!m?.targetTypeCode) { message.warning('조사대상구분 선택 후 [찾기]를 클릭해주세요'); return; }
    if (m.targetTypeCode === '10' || m.targetTypeCode === '20') setTargetOpen(true);   // 10 종목(발행처) → Fnd07_Lookup_IssuingEntity, 20 업종 → Sys09_Lookup_Code("SectorTypeCode")
  };

  const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 };
  const dateField = (value: string | null | undefined, onChange: (v: string) => void) => (
    <DatePicker style={{ width: 110 }} allowClear={false} disabled={!editable} format="YYYY-MM-DD" value={value ? dayjs(value) : null}
      onChange={d => d && onChange(d.format('YYYY-MM-DD'))} />
  );

  return (
    <>
      <LookupModal
        open={open && m != null}
        title="리서치 일정등록"
        width={840}
        maskClosable={false}
        onCancel={close}
        destroyOnHidden
        focusFirst={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" disabled={!editable} onClick={() => void update()}>저장</Button>
              <Button type="save" disabled={!apprEnabled} onClick={apprCheck}>{m?.closeDate == null ? '승인요청' : '요청취소'}</Button>
              <Button type="save" disabled={!okEnabled} onClick={confirmCheck}>승인</Button>
              <Button type="close" onClick={close}>닫기</Button>
            </Space>
          </div>
        }
      >
        {m && (
          <div style={{ padding: '4px 8px', maxHeight: 560, overflowY: 'auto' }}>
            <div style={row}>
              <span style={LABEL}>등록자 :</span>
              <Input readOnly style={{ width: 200 }} value={m.regEmpName ?? ''} />
              <span style={{ width: 20 }} />
              <span style={LABEL}>조사기간 :</span>
              {dateField(m.resrchStartDate, v => set({ resrchStartDate: v }))}
              <span> ~ </span>
              {dateField(m.resrchCloseDate, v => set({ resrchCloseDate: v }))}
            </div>
            <div style={row}>
              <span style={LABEL}>문서구분 :</span>
              <Input readOnly style={{ width: 200 }} value={m.classTreeName ?? ''} />
              {/* [E3] classTreeSearch[찾기].Select (L469) → Dcr01_Lookup_ClassTree.open("resrch", cb) */}
              <Button type="search" disabled={!editable} onClick={() => setClassOpen(true)}>찾기</Button>
              <span style={{ width: 10 }} />
              <span style={LABEL}>조사대상 :</span>
              <SystemCodeComboBox kindCd="ResrchTargetTypeCode" style={{ width: 105 }} disabled={!editable} value={m.targetTypeCode ?? undefined} onChange={c => onTargetType(c)} />
              {issuingVisible && <Input readOnly style={{ width: 160 }} value={m.issuingEntityName ?? ''} />}
              {issuingVisible && <Button type="search" disabled={!editable} onClick={findTarget}>찾기</Button>}
            </div>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <span style={LABEL}>개요 :</span>
              <div style={{ width: 700 }}>
                {/* setHtmlText()·readOnly() L315-321: 등록자가 아니면 읽기 전용 */}
                {isReg
                  ? <HtmlEditor key={`ed-${nonce}`} value={m.visitReason} onChange={h => set({ visitReason: h })} height={200} />
                  : <HtmlView html={m.visitReason} height={200} />}
              </div>
            </div>
            <div style={row}>
              <span style={LABEL}>비고 :</span>
              <Input style={{ width: 700 }} disabled={!editable} maxLength={400} value={m.note ?? ''} onChange={e => set({ note: e.target.value })} />
            </div>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <span style={LABEL}>첨부파일 :</span>
              <div style={{ width: 700, border: '1px solid #d9d9d9', padding: 6 }}>
                {/* fileForm = Sys10_Lookup_SelectMulti(null, "Y", 120): setEnabled()가 편집 가능이면 그대로, 아니면 changeViewLayout() */}
                <Sys10_Lookup_SelectMulti parentId={m.resrchId} editYn={editable} height={120} />
              </div>
            </div>
            <div style={row}>
              <span style={LABEL}>확인자 :</span>
              <Input readOnly style={{ width: 200 }} value={m.cfrmEmpName ?? ''} />
              {/* [E6] cfrmEmpSearch[찾기].Select (L569) → findEmp() L639-653 */}
              <Button type="search" disabled={!editable} onClick={() => setEmpOpen(true)}>찾기</Button>
              <span style={{ width: 10 }} />
              <span style={LABEL}>확인완료일자 :</span>
              <Input readOnly style={{ width: 110 }} value={m.cfrmDate ?? ''} />
            </div>
          </div>
        )}
      </LookupModal>
      <Dcr01_Lookup_ClassTree
        open={classOpen}
        onResult={r => { if (r) set({ classTreeId: r.classTreeId, classTreeName: r.classTreeName }); }}
        onClose={() => setClassOpen(false)}
      />
      <Fnd07_Lookup_IssuingEntity
        open={targetOpen && m?.targetTypeCode === '10'}
        onResult={r => { if (r) set({ issuingEntityId: r.issuingEntityId, issuingEntityName: r.issuingEntityName }); }}
        onClose={() => setTargetOpen(false)}
      />
      <Sys09_Lookup_CodeOpen
        open={targetOpen && m?.targetTypeCode === '20'}
        codeKind="SectorTypeCode"
        onResult={r => set({ issuingEntityId: r.codeId, issuingEntityName: r.name })}
        onClose={() => setTargetOpen(false)}
      />
      <Emp00_Lookup_SelectSingle
        open={empOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        noneLabel={null}
        onResult={r => { if (r) set({ cfrmPersonId: r.personId, cfrmEmpName: `${r.korNm ?? ''} (${r.orgKorNm ?? ''})` }); }}
        onClose={() => setEmpOpen(false)}
      />
    </>
  );
};
