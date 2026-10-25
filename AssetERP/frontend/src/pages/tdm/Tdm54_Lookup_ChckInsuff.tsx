/**
 * 미흡내역 조치 등록 창 (N24) — Tdm54_Tab_CheckInsuff 목록의 조치등록 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm54_Lookup_ChckInsuff.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L123-134: 모달 1320×700(최소 1310×700), 제목 "미흡내역 조치 등록"(open L136-158), 아래 가운데 [닫기]. getEditor() L327-420:
 *   1.조치계획(등록일·등록자·조치완료 예정일·조치 예정자·조치명·조치계획내용 + [발생 점검항목 보기]) 3.조치결과([저장][조치완료][완료취소] + 상태·조치부서·조치완료일·조치자·조치결과)
 *   2.조치기록(툴바 [조회][행 추가][행 삭제][저장] + 체크 그리드: 등록일 100·등록자 100·조치내용 470·비고 420·증빙자료 80·아이콘 30)
 * setReadOnly() L618-666: 상태 이름에 "승인"이 있고(승인반려 26 제외) 또는 조치부서가 내 책무 대상 부서가 아니면 읽기 전용(단추 숨김).
 *   편집이면 조치완료(19)는 [완료취소]만 켜고, 발생·조치중·승인반려(10·11·26)는 [완료취소]만 끈다
 * 서버: tdm.Tdm54_ChckInsuff.updateComplete(U 저장·P 조치완료·C 완료취소), Tdm63_ChckInsuffRecord.select/delete/update
 * 다음 단계: 조치기록의 증빙자료 아이콘(Tdm00_Lookup_RelateAppr "tdm63")은 안내만 (N22와 같다)
 * UX보강(10): 해당 없음
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, Modal, Space, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckApprInsuffRecord, TdmCheckManlDetail, TdmChckInsuffRow } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingleTdm } from '@/components/lookup/Emp00_Lookup_SelectSingleTdm';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Tdm52_Edit_ChckManl, CheckManlEditTarget } from './Tdm52_Edit_ChckManl';
import { useDeferredCrud } from './useDeferredCrud';

const gb = gbFor<TdmCheckApprInsuffRecord>();
const DATE_FORMAT = 'YYYY.MM.DD';
const PENDING = '변경 또는 삭제되지 않은 조치기록 정보가 존재합니다. 조치기록 저장 또는 새로고침하여 확인해 주세요';

interface Props {
  /** 목록에서 고른 행 (AS-IS open(selectModel, callback)) — 값이 있으면 열림 */
  target: TdmChckInsuffRow | null;
  /** AS-IS grid.getStore().update(model) + callback.execute() — 처리마다 서버에서 다시 읽은 행 */
  onChanged: (row: TdmChckInsuffRow) => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; blue?: boolean; top?: boolean; children: React.ReactNode }> = ({ label, blue, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 12 }}>
    <Typography.Text strong style={{ width: 122, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Title: React.FC<{ children: React.ReactNode; extra?: React.ReactNode }> = ({ children, extra }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 8px 5px', minHeight: 32 }}>
    <span style={{ fontSize: 15, fontWeight: 'bold' }}>{children}</span>{extra}
  </div>
);

const dot = (d?: string | null) => (d ? d.replace(/-/g, '.') : '');
const toDay = (d?: string | null) => (d ? dayjs(d, 'YYYY-MM-DD') : null);

export const Tdm54_Lookup_ChckInsuff: React.FC<Props> = ({ target, onChanged, onClose }) => {
  const user = useLoginUser();
  const [model, setModel] = useState<TdmChckInsuffRow | null>(null);          // chckInsuffModel
  const [tdmOrgId, setTdmOrgId] = useState<number | null | undefined>(undefined);   // undefined = 아직 읽지 않음
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [actionDate, setActionDate] = useState<Dayjs | null>(null);
  const [emp, setEmp] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [actionCmnt, setActionCmnt] = useState('');
  const [empLookup, setEmpLookup] = useState(false);
  const [manlView, setManlView] = useState<CheckManlEditTarget | null>(null);
  const [busy, setBusy] = useState(false);

  const insuffId = target?.chckInsuffId ?? null;
  // setReadOnly() L618-631
  const isReadOnly = !model || tdmOrgId === undefined
    || ((model.statusName ?? '').includes('승인') && model.statusCode !== '26')
    || model.orgId !== tdmOrgId;
  const editMode = !isReadOnly && model?.statusCode !== '19';                 // mode = "EDIT" (L646-654: 조치완료는 "VIEW")
  const canComplete = !isReadOnly && ['10', '11', '26'].includes(model?.statusCode ?? '');   // L655-664
  const canCancel = !isReadOnly && model?.statusCode === '19';

  // 조치기록 그리드 — useDeferredCrud: 삭제는 [저장]까지 화면에서만 뺀다 (recordDeleteList)
  const { crud, retrieve, reset, deleteRow, commit, saveCount } = useDeferredCrud<TdmCheckApprInsuffRecord>({
    idField: 'chckInsuffRecordId',
    search: useCallback(async () => (insuffId ? tdmApi.searchCheckApprInsuffRecords(insuffId) : []), [insuffId]),
    newRow: useCallback((): Partial<TdmCheckApprInsuffRecord> => ({ regEmpName: user.name }), [user.name]),
  });

  const pending = saveCount.modified + saveCount.added;       // recordDeleteList.size() + getModifiedRecords().size()
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // recordGirdBuilder() L455-474 — 편집 열(등록일·조치내용·비고)은 편집 모드에서만 파란 편집 열
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일', editMode ? { editor: 'date' } : undefined),  // L466
    gb.textCenter('regEmpName', 100, '등록자'),  // L467
    gb.textArea('content', 470, '조치내용', editMode ? { editor: 'largeText' } : undefined),  // L468
    gb.textArea('note', 420, '비고', editMode ? { editor: 'largeText' } : undefined),  // L469
    gb.textCenter('fileCountStr', 80, '증빙자료'),  // L470
    // L458-463 fileCell → lookupFile() L597-616: 저장 안 한 변경이 있으면 "저장 후 증빙자료를 연결하세요", 아니면 Tdm00_Lookup_RelateAppr (다음 단계 — 안내만)
    iconCell<TdmCheckApprInsuffRecord>('edit', 'fileCell', 30, ' ', () => {
      if (crudRef.current.hasChanges()) { message.warning('저장 후 증빙자료를 연결하세요'); return; }
      message.info('증빙자료 창(Tdm00_Lookup_RelateAppr)은 다음 단계에서 연결됩니다');
    }),
  ], [editMode]);

  // [E0] 화면 열림 (생성자 L123-134, open L136-158) → setting() L160-182 setTdmOrgId() L306-325, retrieveRecord()
  useEffect(() => {
    if (!target) { setModel(null); setTdmOrgId(undefined); reset(); return; }
    setModel(target);
    setTdmOrgId(undefined);
    let alive = true;
    tdmApi.getTdmOrgId()
      .then(id => { if (alive) setTdmOrgId(id); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    void retrieve();
    return () => { alive = false; };
  }, [target]);   // eslint-disable-line react-hooks/exhaustive-deps

  // editDriver.edit(model) — 모델이 바뀔 때마다 폼 값을 채운다
  useEffect(() => {
    if (!model) return;
    setDueDate(toDay(model.dueDate));
    setActionDate(toDay(model.actionDate));
    setEmp({ id: model.actionEmpId ?? null, name: model.actionEmpName ?? '' });
    setActionCmnt(model.actionCmnt ?? '');
  }, [model]);

  // setTdmOrgId() L319-322: 조치자가 비어 있고 [저장]이 보이면(편집) 로그인 사용자
  useEffect(() => {
    if (model && !isReadOnly && model.actionEmpId == null) setEmp(e => (e.id == null ? { id: user.userId, name: user.name } : e));
  }, [model, isReadOnly]);   // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] manlButton[발생 점검항목 보기].Select (L172) → tdm.Tdm52_ChckManl.selectById(chckManlId) → Tdm52_Edit_ChckManl.view(model)
  const viewManl = async () => {
    if (!model) return;
    try {
      const manl: TdmCheckManlDetail = await tdmApi.getCheckManl(model.chckManlId);
      setManlView({ manl, mode: 'view' });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // update(procType) L476-519: tdm.Tdm54_ChckInsuff.updateComplete
  const update = async (procType: 'U' | 'P' | 'C') => {
    if (!model) return;
    if (pending !== 0) { message.warning(PENDING); return; }
    setBusy(true);
    try {
      const row = await tdmApi.updateChckInsuffResult(model.chckInsuffId, {
        procType, dueDate: dueDate?.format('YYYY-MM-DD') ?? null, actionDate: actionDate?.format('YYYY-MM-DD') ?? null, actionEmpId: emp.id, actionCmnt: actionCmnt || null,
      });
      setModel(row);                                                         // editDriver.edit(chckInsuffModel)
      onChanged(row);                                                        // grid.getStore().update + callback.execute()
      if (procType === 'P') { message.info('조치가 완료되었습니다'); onClose(); }          // hide()
      else if (procType === 'C') message.info('조치완료가 취소되었습니다');
      else message.info('저장이 완료되었습니다.');
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
    } finally {
      setBusy(false);
    }
  };

  const confirm = (content: string, width: number, procType: 'P' | 'C') => {
    Modal.confirm({ title: '확인', content, width, okText: '예', cancelText: '아니오', onOk: () => update(procType) });
  };

  // [E2] updateButton[저장].Select (L193) → update("U")
  const onUpdate = () => update('U');

  // [E3] completeButton[조치완료].Select (L199) → 검사 → messageBox YES [E4] (L220) → update("P")
  const onComplete = () => {
    if (!actionDate) { message.warning('조치완료일을 입력하세요'); return; }
    if (!model?.regDate || !actionDate.isAfter(dayjs(model.regDate, 'YYYY-MM-DD'), 'day')) { message.warning('조치완료일은 조치계획 등록일보다 미래일이어야 합니다'); return; }
    if (emp.id == null) { message.warning('조치자를 선택하세요'); return; }
    if (!actionCmnt) { message.warning('조치결과를 입력하세요'); return; }
    confirm('조치완료 하시겠습니까?', 300, 'P');
  };

  // [E5] cancelButton[완료취소].Select (L232) → messageBox YES [E6] (L236) → update("C")
  const onCancel = () => confirm('조치완료를 취소하시겠습니까?', 350, 'C');

  // [E7] closeButton[닫기].Select (L248) → 저장하지 않은 조치기록이 있으면 안내, 아니면 hide()
  const onCloseClick = () => {
    if (pending !== 0) { message.warning(PENDING); return; }
    onClose();
  };

  // [E8] retrieveRecordButton[조회].Select (L259) → retrieveRecord() L521-533
  // [E9] insertRecordButton[행 추가].Select (L265) → recordInsertRow() L535-548: 등록일 오늘, 등록자 로그인 사용자 (조치기록 ID는 서버가 낸다)
  const insertRow = () => crud.addRows([{ regDate: dayjs().format('YYYY-MM-DD'), regEmpName: user.name }], true);

  // [E10] deleteRecordButton[행 삭제].Select (L271) → recordDeleteRow() L550-556 — deleteRow
  // [E11] updateRecordButton[저장].Select (L277) → recordUpdate() L558-595: tdm.Tdm63_ChckInsuffRecord.delete → update
  const recordUpdate = () => {
    if (!model) return;
    if (pending === 0) { message.warning('저장할 내역이 없습니다.'); return; }
    return commit({
      validate: changed => {
        for (const r of changed) {
          if (!r.regDate) return '등록일을 입력하세요';
          if (!r.content) return '조치내용을 입력하세요';
        }
        return undefined;
      },
      save: changed => tdmApi.saveChckInsuffRecords(model.chckInsuffId, {
        deleteIds: [], rows: changed.map(r => ({ chckInsuffRecordId: r.chckInsuffRecordId, regDate: r.regDate ?? null, content: r.content ?? null, note: r.note ?? null })),
      }),
      remove: ids => tdmApi.saveChckInsuffRecords(model.chckInsuffId, { deleteIds: ids, rows: [] }),
    });
  };

  return (
    <Modal
      open={!!target}
      title={<b>미흡내역 조치 등록</b>}
      width="min(1320px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={onCloseClick}>닫기</Button></div>}
    >
      {model && (
        <div style={{ maxHeight: 'calc(100vh - 190px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title extra={<Button type="search" onClick={viewManl}>발생 점검항목 보기</Button>}>1. 조치계획</Title>
              <div style={{ border: '1px solid #d9d9d9', padding: '15px 15px 3px 5px' }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="등록일"><Input readOnly value={dot(model.regDate)} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="등록자"><Input readOnly value={model.planRegEmpName ?? ''} /></Row></div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <Row label="조치완료 예정일" blue>
                      <DatePicker style={{ width: '100%' }} format={DATE_FORMAT} disabled={isReadOnly} value={dueDate} onChange={setDueDate} />
                    </Row>
                  </div>
                  <div style={{ flex: 1 }}><Row label="조치 예정자"><Input readOnly value={model.planActionEmpName ?? ''} /></Row></div>
                </div>
                <Row label="조치명"><Input readOnly value={model.actionName ?? ''} /></Row>
                <Row label="조치계획내용" top><Input.TextArea readOnly style={{ height: 116, resize: 'none' }} value={model.actionPlan ?? ''} /></Row>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title extra={!isReadOnly && (
                <Space>
                  <Button type="save" disabled={busy || !canComplete} onClick={onUpdate}>저장</Button>
                  <Button type="save" disabled={busy || !canComplete} onClick={onComplete}>조치완료</Button>
                  <Button type="cancel" disabled={busy || !canCancel} onClick={onCancel}>완료취소</Button>
                </Space>
              )}>3. 조치결과</Title>
              <div style={{ border: '1px solid #d9d9d9', padding: '15px 15px 3px 5px' }}>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}><Row label="상태"><Input readOnly value={model.statusName ?? ''} /></Row></div>
                  <div style={{ flex: 1 }}><Row label="조치부서"><Input readOnly value={model.orgName ?? ''} /></Row></div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <Row label="조치완료일" blue>
                      <DatePicker style={{ width: '100%' }} format={DATE_FORMAT} disabled={isReadOnly} value={actionDate} onChange={setActionDate} />
                    </Row>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Row label="조치자" blue>
                      {/* [E12] actionEmpName[조치자].TriggerClick (L285) → Emp00_Lookup_SelectSingleTdm.open(오늘, tdmOrgId, cb) */}
                      <LookupInput value={emp.name} width={260} disabled={isReadOnly} onOpen={() => setEmpLookup(true)} />
                    </Row>
                  </div>
                </div>
                <Row label="조치결과" blue top>
                  <Input.TextArea readOnly={isReadOnly} style={{ height: 150, resize: 'none' }} value={actionCmnt} onChange={e => setActionCmnt(e.target.value)} />
                </Row>
              </div>
            </div>
          </div>
          <Title extra={
            <Space>
              <Button type="search" onClick={() => void retrieve()}>조회</Button>
              {!isReadOnly && <Button type="addRow" disabled={!editMode} onClick={insertRow}>행 추가</Button>}
              {!isReadOnly && <Button type="removeRow" disabled={!editMode} onClick={deleteRow}>행 삭제</Button>}
              {!isReadOnly && <Button type="save" count={saveCount} disabled={!editMode} onClick={recordUpdate}>저장</Button>}
            </Space>
          }>2. 조치기록</Title>
          <div style={{ height: 230 }}>
            <CellEditGrid<TdmCheckApprInsuffRecord> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      )}
      <Emp00_Lookup_SelectSingleTdm
        open={empLookup}
        stdDate={dayjs().format('YYYY-MM-DD')}
        orgId={tdmOrgId ?? undefined}
        onResult={p => { setEmpLookup(false); setEmp({ id: p.personId, name: p.korNm ?? '' }); }}
        onClose={() => setEmpLookup(false)}
      />
      <Tdm52_Edit_ChckManl target={manlView} onChanged={() => undefined} onClose={() => setManlView(null)} />
    </Modal>
  );
};
