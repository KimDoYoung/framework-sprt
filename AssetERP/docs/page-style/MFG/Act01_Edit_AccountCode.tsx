/**
 * 계정코드 편집 창 (E27) — Act01_Tab_AccountCode의 [생성]·수정 칸에서 연다
 * AS-IS: myApp/client/vi/act/Act01_Edit_AccountCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L134-160: 모달 760×750 "계정코드", 가운데 [저장][닫기]. getEditor() L232-310: 라벨 폭 135, 상위계정 · 계정코드/정렬코드 · 계정과목 · 계정과목(출력용) · 계정영문명 ·
 * 계정속성/출력여부/전표생성여부 · 차대구분/사용여부 · 내용(높이 100) · 금감원보고여부/금감원기준 전표생성여부 · 금감원용 계정과목 · 이익제공(수령) 목적/내용/[선택][삭제] · 연결 그리드(405 + ▲ + ▼)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { Button as AntButton } from 'antd';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCodeAdmin, ActCodeOption, ActLink } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act01_Lookup_Parent } from './Act01_Lookup_Parent';

const gb = gbFor<ActLink>();
const REQUIRED = '#0069B4';  // setHtmlStyle("…", "0069B4") — 필수 항목 라벨 색

/** 열 때 받는 값: accountCodeId가 없으면 새 계정(회사만 정해져 있다) */
export type AccountCodeEdit = Partial<AccountCodeAdmin>;

interface Props {
  /** 편집할 계정 — null이면 닫힘 */
  model: AccountCodeEdit | null;
  onClose: () => void;
  /** AS-IS callBack.execute(): 저장하면 목록을 다시 읽는다 */
  onDone: () => void;
}

/** 라벨 폭 135 (form.setLabelWidth(135)) */
const Field: React.FC<{ label: string; color?: string; width?: number | string; labelWidth?: number; children: React.ReactNode }> = ({ label, color, width = '100%', labelWidth = 135, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width }}>
    <Typography.Text style={{ width: labelWidth, flex: 'none', lineHeight: '32px', color }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);
/** CheckBox: DB 형태 'true'/'false' */
const isTrue = (s: string | null | undefined) => s === 'true';

export const Act01_Edit_AccountCode: React.FC<Props> = ({ model, onClose, onDone }) => {
  const linkGridRef = useRef<AgGridReact<ActLink>>(null);
  const [f, setF] = useState<AccountCodeEdit | null>(model);
  const [saving, setSaving] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [links, setLinks] = useState<ActLink[]>([]);
  const [purposeCode, setPurposeCode] = useState<string | undefined>();
  const [contentCode, setContentCode] = useState<string | undefined>();
  const [contents, setContents] = useState<ActCodeOption[]>([]);

  // retrieveLink() L416-421: 로그인 회사의 그 계정 연결정보
  const retrieveLink = useCallback(async (accountCode: string | null | undefined) => {
    try {
      setLinks(accountCode ? await actApi.searchLinks(accountCode) : []);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L134-160) → setting(), show(). edit() L124-132는 연결정보도 읽는다, insert() L113-122는 읽지 않는다
  useEffect(() => {
    setF(model);
    setLinks([]);
    setPurposeCode(undefined);
    setContentCode(undefined);
    setContents([]);
    if (model?.accountCodeId != null) void retrieveLink(model.accountCode);
  }, [model, retrieveLink]);

  const columnDefs = useMemo(() => [
    gb.text('provideName', 405, '이익제공(수령) 목적-내용'),  // L359
    moveCol('up', '▲', row => changeRow(row, 'up')),  // L361 addCellNotSort(ImageCell("▲"))
    moveCol('down', '▼', row => changeRow(row, 'down')),  // L362 addCellNotSort(ImageCell("▼"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [links]);

  if (!f) return null;
  const set = <K extends keyof AccountCodeEdit>(k: K, v: AccountCodeEdit[K]) => setF(prev => prev && { ...prev, [k]: v });

  // changeRow() L366-385 · getSeq() L387-414: 한 칸 위/아래로 옮기고 보이는 순서대로 조회순서를 1부터 다시 매겨 저장한다
  // (원본은 선택한 행을 옮기지만 ▲▼ 셀이 그 행을 선택하므로 누른 행을 옮긴다)
  function changeRow(row: ActLink, code: 'up' | 'down') {
    const idx = links.findIndex(l => l.linkId === row.linkId);
    const to = code === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || to < 0 || to >= links.length) return;
    const next = [...links];
    next.splice(idx, 1);
    next.splice(to, 0, row);
    setLinks(next.map((l, i) => ({ ...l, seq: i + 1 })));
    actApi.orderLinks(next.map(l => l.linkId)).catch(err => message.error(errorMessage(err, '저장 실패')));
  }

  // [E5] parentName[상위계정].TriggerClick (L178) → Act01_Lookup_Parent.open(): 고른 계정의 코드·이름을 상위계정에
  const onParentResult = (row: AccountCodeAdmin) => {
    setF(prev => prev && { ...prev, parentCode: row.accountCode, parentName: row.accountName });
    setParentOpen(false);
  };

  // [E6] providePurName[ProvidePurCode].ValueChange (L195) → 내용을 비우고 refreshCode() L223-230: 목적코드로 시작하는 ProvideContentCode
  const onPurposeChange = async (code: string | undefined) => {
    setPurposeCode(code);
    setContentCode(undefined);
    setContents([]);
    if (!code) return;
    try {
      setContents(await actApi.searchProvideContents(code));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E7] provideInsertButton[선택].Select (L206) → insertRow() L423-450
  const insertRow = async () => {
    if (!purposeCode) return message.warning('이익제공(수령) 목적을 선택해주세요');
    if (!contentCode) return message.warning('이익제공(수령) 내용을 선택해주세요');
    try {
      await actApi.createLink(f.accountCode ?? '', contentCode);
      await retrieveLink(f.accountCode);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E8] provideDeleteButton[삭제].Select (L212) → deleteRow() L452-478 → [E9] msgBox.DialogHide [YES] (L460): act.Act14_Link.delete
  const deleteRow = () => {
    const checked = linkGridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) return message.warning('삭제할 연결정보를 선택해주세요');
    Modal.confirm({
      title: '확인',
      content: '선택한 이익제공(수령) 연결정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await actApi.deleteLinks(checked.map(l => l.linkId));
          await retrieveLink(f.accountCode);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E1] updateButton[저장].Select (L143) → update() L312-342
  const update = async () => {
    if (n(f.accountCode) == null) return message.warning('계정코드는 필수입력 항목입니다');
    if (n(f.accountName) == null) return message.warning('계정과목은 필수입력 항목입니다');
    if (n(f.attributeCode) == null) return message.warning('계정속성은 필수선택 항목입니다');
    if (n(f.drcrType) == null) return message.warning('차대구분은 필수선택 항목입니다');
    setSaving(true);
    try {
      await actApi.saveAccountCode({
        accountCodeId: f.accountCodeId ?? null,
        accountCode: f.accountCode!, accountName: f.accountName!,
        accountName2: n(f.accountName2), accountEName: n(f.accountEName), parentCode: n(f.parentCode),
        attributeCode: n(f.attributeCode), drcrType: n(f.drcrType),
        slipYn: String(isTrue(f.slipYn)), printYn: String(isTrue(f.printYn)), useYn: String(isTrue(f.useYn)),
        fssYn: String(isTrue(f.fssYn)), fssAccountName: n(f.fssAccountName), fssSlipYn: String(isTrue(f.fssSlipYn)),
        printSeq: n(f.printSeq), content: n(f.content),
      });
      onClose();
      onDone();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const text = (k: 'accountCode' | 'accountName' | 'accountName2' | 'accountEName' | 'printSeq' | 'fssAccountName') => (
    <Input value={f[k] ?? ''} onChange={e => set(k, e.target.value)} />
  );
  const check = (k: 'printYn' | 'slipYn' | 'useYn' | 'fssYn' | 'fssSlipYn') => (
    <Checkbox checked={isTrue(f[k])} onChange={e => set(k, String(e.target.checked))} />
  );

  return (
    <Modal
      open
      title="계정코드"
      width={780}
      maskClosable={false}
      onCancel={onClose}
      styles={{ body: { maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L149) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 2px 2px' }}>
        <Field label="상위계정">
          <Input readOnly value={f.parentName ?? ''} suffix={<SearchOutlined />} style={{ cursor: 'pointer' }} onClick={() => setParentOpen(true)} />
        </Field>
        <Space size={0} align="start">
          <Field label="계정코드" color={REQUIRED} width={330}>{text('accountCode')}</Field>
          <Field label="정렬코드" color={REQUIRED} width={400} labelWidth={105}>{text('printSeq')}</Field>
        </Space>
        <Field label="계정과목" color={REQUIRED}>{text('accountName')}</Field>
        <Field label="계정과목(출력용)">{text('accountName2')}</Field>
        <Field label="계정영문명">{text('accountEName')}</Field>
        <Space size={0} align="start">
          <Field label="계정속성" color={REQUIRED} width={330}>
            {/* [E3] attributeName[계정속성].Collapse (L164) → attributeCode = 고른 코드 */}
            <SystemCodeComboBox kindCd="AccountAttributeCode" placeholder="선택" style={{ width: '100%' }}
              value={f.attributeCode ?? undefined} onChange={code => set('attributeCode', code ?? null)} />
          </Field>
          <Field label="출력여부" width={235} labelWidth={105}>{check('printYn')}</Field>
          <Field label="전표생성여부" width={165} labelWidth={105}>{check('slipYn')}</Field>
        </Space>
        <Space size={0} align="start">
          <Field label="차대구분" color={REQUIRED} width={330}>
            {/* [E4] drcrName[차대구분].Collapse (L171) → drcrType = 고른 코드 */}
            <SystemCodeComboBox kindCd="DrcrType" placeholder="선택" style={{ width: '100%' }}
              value={f.drcrType ?? undefined} onChange={code => set('drcrType', code ?? null)} />
          </Field>
          <Field label="사용여부" width={235} labelWidth={105}>{check('useYn')}</Field>
        </Space>
        <Field label="내용">
          <Input.TextArea rows={4} value={f.content ?? ''} onChange={e => set('content', e.target.value)} />
        </Field>
        <Space size={0} align="start">
          <Field label="금감원보고여부" width={330}>{check('fssYn')}</Field>
          <Field label="금감원기준 전표생성여부" width={400} labelWidth={200}>{check('fssSlipYn')}</Field>
        </Space>
        <Field label="금감원용 계정과목">{text('fssAccountName')}</Field>
        <Field label="이익제공(수령)">
          <Space>
            <SystemCodeComboBox kindCd="ProvidePurCode" placeholder="목적" style={{ width: 120 }} value={purposeCode} onChange={code => void onPurposeChange(code)} />
            <Select<string> placeholder="내용" style={{ width: 150 }} value={contentCode} onChange={setContentCode}
              options={contents.map(c => ({ value: c.code, label: c.name }))} allowClear />
            <Button type="select" onClick={insertRow}>선택</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </Space>
        </Field>
        <div style={{ height: 210, marginLeft: 135 - 0, width: 'calc(100% - 135px)' }}>
          <MultiGrid<ActLink>
            gridRef={linkGridRef}
            rowData={links}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.linkId)}
          />
        </div>
      </div>
      <Act01_Lookup_Parent open={parentOpen} onResult={onParentResult} onClose={() => setParentOpen(false)} />
    </Modal>
  );
};

/** ▲▼ 셀 (AS-IS addCellNotSort(ImageCell("▲"/"▼"))) — 누른 행을 한 칸 옮긴다 */
function moveCol(colId: 'up' | 'down', label: string, onClick: (row: ActLink) => void) {
  return {
    colId,
    width: 30,
    headerName: '',
    headerClass: 'gb-hdr',
    editable: false,
    sortable: false,
    cellStyle: { padding: 0, textAlign: 'center' },
    cellRenderer: (p: { data?: ActLink }) => (
      <AntButton type="text" size="small" onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }}>{label}</AntButton>
    ),
  };
}
