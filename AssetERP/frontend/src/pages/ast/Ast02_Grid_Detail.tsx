/**
 * 고유자산 종목상세 컴포넌트 (W02) — Ast01_Tab_InfoIntrinsic 오른쪽
 * AS-IS: myApp/client/vi/ast/Ast02_Grid_Detail.java (593줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 운용자산 쪽 Ast02_Grid_DetailManagement(R09)와 달리 상세 그리드 오른쪽에 회계정보·기타정보 폼이 있고,
 * 항목(title)은 읽기 전용이며, 기본항목을 더할 때 순번(seq)을 함께 넣는다.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { DatePicker, Form, InputNumber, message, Select, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useGridCrud } from '@/hooks/useGridCrud';
import { AstClassTree, AstItemDetail, AstItemDetailSaveReq } from '@/types/ast';
import { Code } from '@/types/sys';
import { Ast02_Lookup_Detail } from './Ast02_Lookup_Detail';
import { Ast03_Lookup_CfInfo } from './Ast03_Lookup_CfInfo';
import { Ast10_Grid_Manager, Ast10GridManagerHandle } from './Ast10_Grid_Manager';

export interface Ast02GridDetailHandle {
  loadNode: (node: AstClassTree) => void;
  visible: () => void;
  clear: () => void;
}

interface Props {
  /** 저장한 종목 정보(내용·회계정보)를 부른 쪽 트리 목록에도 반영 — 같은 종목을 다시 고르면 저장한 값이 보여야 한다 */
  onNodeSaved?: (node: AstClassTree) => void;
}

const gb = gbFor<AstItemDetail>();

/** 폼 칸 한 줄 (라벨 오른쪽 정렬, 12-화면우선원칙 4) */
const labelCol = { flex: '120px' };

export const Ast02_Grid_Detail = forwardRef<Ast02GridDetailHandle, Props>(({ onNodeSaved }, ref) => {
  // [E0] 화면 열림 (생성자 L141-145) → settings(), makeLayout()
  const [form] = Form.useForm();
  const [node, setNode] = useState<AstClassTree | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [cfOpen, setCfOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [corpName, setCorpName] = useState('');

  const managerRef = useRef<Ast10GridManagerHandle>(null);
  const nodeRef = useRef<AstClassTree | null>(null);
  nodeRef.current = node;

  // 중분류·소분류 코드는 미리 읽어 두고 선택한 상위 코드로 거른다 (AS-IS refreshCode: 서버 selectByKindCode, code LIKE '상위코드%')
  const [mCodes, setMCodes] = useState<Code[]>([]);
  const [sCodes, setSCodes] = useState<Code[]>([]);
  useEffect(() => {
    sysApi.searchCodes('ItemMClassCode').then(setMCodes).catch(() => setMCodes([]));
    sysApi.searchCodes('ItemSClassCode').then(setSCodes).catch(() => setSCodes([]));
  }, []);
  const lCode: string | undefined = Form.useWatch('itemLClassCode', form);
  const mCode: string | undefined = Form.useWatch('itemMClassCode', form);
  const depnType: string | undefined = Form.useWatch('depnType', form);
  const mOptions = useMemo(
    () => (lCode ? mCodes.filter((c) => c.code.startsWith(lCode)) : []).map((c) => ({ value: c.code, label: c.name })),
    [lCode, mCodes]
  );
  const sOptions = useMemo(
    () => (mCode ? sCodes.filter((c) => c.code.startsWith(mCode)) : []).map((c) => ({ value: c.code, label: c.name })),
    [mCode, sCodes]
  );

  // setDepn() L414-428: 1 정액법(기간만) / 2 정률법(기간·율) / 해당없음(둘 다 비활성·비움)
  const depnYearEnabled = depnType === '1' || depnType === '2';
  const depnRateEnabled = depnType === '2';
  useEffect(() => {
    if (depnType === '1') form.setFieldValue('depnRate', null);
    else if (depnType !== '2') form.setFieldsValue({ depnYear: null, depnRate: null });
  }, [depnType, form]);

  // AS-IS update() 검사 — 순번·항목 필수
  const validateRows = (changed: AstItemDetail[]): string | undefined => {
    for (const model of changed) {
      if (model.seq == null) return '순번을 입력해주세요';
      if (model.title == null) return '항목을 입력해주세요';
    }
    return undefined;
  };

  const crud = useGridCrud<AstItemDetail>({
    idField: 'detailId',
    validate: validateRows,
    deleteConfirm: (n) => `${n}건의 항목을 삭제하시겠습니까?`,
    search: useCallback(async () => {
      const active = nodeRef.current;
      if (!active?.classTreeId) return [];
      return astApi.getItemDetails(active.classTreeId);
    }, []),
    save: useCallback(async (changed: AstItemDetail[]) => {
      const active = nodeRef.current;
      if (!active?.classTreeId) return [];
      const payload: AstItemDetailSaveReq[] = changed.map((r) => ({
        detailId: r.detailId > 0 ? r.detailId : undefined,
        astClassTreeId: active.classTreeId,
        seq: r.seq,
        title: r.title,
        value: r.value,
        note: r.note,
        useYn: r.useYn ?? 'true',
        defaultYn: r.defaultYn ?? 'false',
        tag: r.tag,
      }));
      return astApi.saveItemDetails(payload);
    }, []),
    remove: astApi.deleteItemDetails,
    newRow: useCallback(
      () => ({ astClassTreeId: nodeRef.current?.classTreeId ?? 0, useYn: 'true', defaultYn: 'false' }),
      []
    ),
    reloadAfterSave: true,
  });

  // retrieve(classTreeModel) L430-453: 담당자 그리드·폼(editDriver.edit)·내용(editData)·상세 목록
  // [E1] retrieveButton[조회].Select (L162) → retrieve()
  // [E4] cfButton[현금흐름표].Select 닫힘 뒤에도 retrieve()
  const retrieve = useCallback(
    async (target?: AstClassTree | null) => {
      const active = target ?? nodeRef.current;
      if (!active || !active.classTreeId) {
        crud.clear();
        setContent('');
        setEditorKey((k) => k + 1);
        return;
      }
      setEnabled(true);
      setNode(active);
      nodeRef.current = active;
      setContent(active.content || '');
      setEditorKey((k) => k + 1);
      form.setFieldsValue({
        itemLClassCode: active.itemLClassCode ?? undefined,
        itemMClassCode: active.itemMClassCode ?? undefined,
        itemSClassCode: active.itemSClassCode ?? undefined,
        accountType: active.accountType ?? undefined,
        curCode: active.curCode ?? undefined,
        depnType: active.depnType ?? '',
        depnYear: active.depnYear ?? null,
        depnRate: active.depnRate ?? null,
        issueDate: active.issueDate ? dayjs(active.issueDate) : null,
        matDate: active.matDate ? dayjs(active.matDate) : null,
        trUnit: active.trUnit ?? null,
        corpId: active.corpId ?? null,
      });
      setCorpName(active.corpName ?? '');
      managerRef.current?.retrieve(active.classTreeId);
      await crud.retrieve();
    },
    [crud.clear, crud.retrieve, form]
  );

  // visible() L394-396: this.setEnabled(false)
  const visible = useCallback(() => setEnabled(false), []);

  const clear = useCallback(() => {
    setEnabled(false);
    setNode(null);
    nodeRef.current = null;
    crud.clear();
    form.resetFields();
    setCorpName('');
    setContent('');
    setEditorKey((k) => k + 1);
    managerRef.current?.clear();
  }, [crud.clear, form]);

  useImperativeHandle(ref, () => ({ loadNode: (n) => { retrieve(n); }, visible, clear }));

  // [E5] addButton[항목추가].Select (L197) → Ast02_Lookup_Detail.open → insert(목록) L517-529 (순번·항목을 기본항목에서 가져옴)
  const insert = () => {
    if (!node) {
      message.warning('좌측 자산종목을 선택해주세요');
      return;
    }
    setDetailOpen(true);
  };

  const handleSelectTemplates = (templates: AstItemDetail[]) => {
    if (!node) return;
    crud.addRows(
      templates.map((t) => ({
        astClassTreeId: node.classTreeId,
        seq: t.seq,
        title: t.title,
        value: '',
        note: '',
        useYn: 'true',
        defaultYn: 'false',
        tag: t.tag,
      })),
      true
    );
  };

  // [E4] cfButton[현금흐름표].Select (L180) → Ast03_Lookup_CfInfo.editData → 닫힌 뒤 retrieve()
  const openCfInfo = () => {
    if (!node) {
      message.warning('좌측 자산종목을 선택해주세요');
      return;
    }
    setCfOpen(true);
  };

  // [E3] deleteButton[삭제].Select (L174) → deleteRow() L539-563
  // [E16] msgBox.DialogHide [YES] (L547) → delete(): deleteConfirm 확인 뒤 DELETE
  const deleteRow = () => {
    if ((crud.gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
      message.warning('삭제할 항목을 선택해주세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E2] updateButton[저장].Select (L168) → update() L455-515
  // 순서: 그리드 검사 → 내용·폼 저장(modelUpdate) → 그리드 저장(GridUpdate)
  const update = async () => {
    if (!node) return;
    crud.gridRef.current?.api?.stopEditing();
    const invalid = validateRows(crud.getChanged());
    if (invalid) {
      message.warning(invalid);
      return;
    }
    const v = form.getFieldsValue();
    const updated: AstClassTree = {
      ...node,
      content,
      itemLClassCode: v.itemLClassCode ?? null,
      itemMClassCode: v.itemMClassCode ?? null,
      itemSClassCode: v.itemSClassCode ?? null,
      accountType: v.accountType ?? null,
      curCode: v.curCode ?? null,
      depnType: v.depnType || null,
      depnYear: v.depnYear ?? null,
      depnRate: v.depnRate ?? null,
      issueDate: v.issueDate ? (v.issueDate as Dayjs).format('YYYY-MM-DD') : null,
      matDate: v.matDate ? (v.matDate as Dayjs).format('YYYY-MM-DD') : null,
      trUnit: v.trUnit ?? null,
      corpId: v.corpId ?? null,
      corpName,
    };
    try {
      await astApi.updateItemClass(node.classTreeId, {
        classTreeId: node.classTreeId,
        content,
        itemLClassCode: updated.itemLClassCode,
        itemMClassCode: updated.itemMClassCode,
        itemSClassCode: updated.itemSClassCode,
        itemDClassCode: node.itemDClassCode,
        accountType: updated.accountType,
        trUnit: updated.trUnit,
        issueDate: updated.issueDate,
        matDate: updated.matDate,
        corpId: updated.corpId,
        curCode: updated.curCode,
        depnYear: updated.depnYear,
        depnRate: updated.depnRate,
        depnType: updated.depnType,
        evalType: node.evalType,
      });
    } catch (e) {
      message.error(errorMessage(e));
      return;
    }
    setNode(updated);
    nodeRef.current = updated;
    onNodeSaved?.(updated);

    // 그리드에 바뀐 행이 없으면 완료 메시지만, 있으면 saveRows가 건수와 함께 알린다
    if (crud.getChanged().length === 0) {
      message.success('저장이 완료되었습니다.');
      return;
    }
    await crud.saveRows();
  };

  // buildGrid() L381-392 — 항목(title)은 편집기 없음, 비고 폭 200
  const columns: ColDef<AstItemDetail>[] = useMemo(
    () => [
      gb.longCenter('seq', 70, '순번', { editor: 'number' }),
      gb.textCenter('title', 120, '항목'),
      gb.textArea('value', 350, '정보', { editor: 'largeText' }),
      gb.textArea('note', 200, '비고', { editor: 'largeText' }),
    ],
    []
  );

  const isDisabled = !enabled || !node;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: 8,
        opacity: isDisabled ? 0.6 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
      }}
    >
      {/* center(0.55): 툴바 + 상세 그리드(0.7) | 회계·기타정보 폼(0.3) */}
      <div style={{ flex: 55, minHeight: 0, display: 'flex', gap: 8 }}>
        <div style={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* [E1] retrieveButton[조회].Select */}
              <Button type="search" onClick={() => retrieve()} disabled={isDisabled}>조회</Button>
              {/* [E3] deleteButton[삭제].Select */}
              <Button type="delete" onClick={deleteRow} disabled={isDisabled}>삭제</Button>
              {/* [E5] addButton[항목추가].Select */}
              <Button type="register" onClick={insert} disabled={isDisabled}>항목추가</Button>
            </div>
            {/* [E4] cfButton[현금흐름표].Select */}
            <Button type="register" onClick={openCfInfo} disabled={isDisabled}>현금흐름표</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<AstItemDetail> crud={crud} columnDefs={columns} rowNumber={false} />
          </div>
        </div>

        <div style={{ flex: 3, minWidth: 330, overflow: 'auto' }}>
          <Form
            form={form}
            disabled={isDisabled}
            labelCol={labelCol}
            wrapperCol={{ flex: 1 }}
            labelAlign="right"
            colon={false}
            size="small"
          >
            <div style={{ fontWeight: 600, margin: '4px 0 10px' }}>※ 회계정보</div>
            {/* [E7] itemLClassName[ItemLClassCode].ValueChange (L218) → 중·소분류 비움, refreshCode() */}
            {/* [E9] itemLClassName[ItemLClassCode].Collapse (L248) → itemLClassCode = 선택 코드 (폼 값이 곧 코드) */}
            <Form.Item label="자산구분(대분류)" name="itemLClassCode" style={{ marginBottom: 8 }}>
              <SystemCodeComboBox
                kindCd="ItemLClassCode"
                placeholder="선택"
                onChange={() => form.setFieldsValue({ itemMClassCode: undefined, itemSClassCode: undefined })}
              />
            </Form.Item>
            {/* [E8] itemMClassName.ValueChange (L228) → 소분류 비움, refreshCode(), 이름에 따라 거래단위 기본값 */}
            {/* [E10] itemMClassName.Collapse (L254) / [E12] itemMClassName.TriggerClick (L266) → refreshCode() — 목록을 미리 읽어 두고 상위 코드로 거른다 */}
            <Form.Item label="자산구분(중분류)" name="itemMClassCode" style={{ marginBottom: 8 }}>
              <Select
                allowClear
                placeholder="선택"
                options={mOptions}
                onChange={(code) => {
                  form.setFieldValue('itemSClassCode', undefined);
                  const name = mCodes.find((c) => c.code === code)?.name;
                  if (name === '주식' || name === '신주인수권증서' || name === '출자금') form.setFieldValue('trUnit', 1);
                  else if (name === '채권') form.setFieldValue('trUnit', 10000);
                  else if (name === '집합투자증권') form.setFieldValue('trUnit', 1000);
                }}
              />
            </Form.Item>
            {/* [E11] itemSClassName.Collapse (L260) / [E13] itemSClassName.TriggerClick (L272) → refreshCode() */}
            <Form.Item label="자산구분(소분류)" name="itemSClassCode" style={{ marginBottom: 8 }}>
              <Select allowClear placeholder="선택" options={sOptions} />
            </Form.Item>
            {/* [E6] accountName[계정구분].Collapse (L211) → accountType = 선택 코드 */}
            <Form.Item label="계정구분" name="accountType" style={{ marginBottom: 8 }}>
              <SystemCodeComboBox kindCd="AccountType" placeholder="선택" />
            </Form.Item>
            <Form.Item label="적용통화" name="curCode" style={{ marginBottom: 8 }}>
              <SystemCodeComboBox kindCd="CurCode" />
            </Form.Item>
            {/* [E14] depnTypeName[감가상각방식].Collapse (L279) → setDepn(코드) */}
            <Form.Item label="감가상각방식" name="depnType" style={{ marginBottom: 8 }}>
              <SystemCodeComboBox kindCd="DepnType" altCode={['', '(해당없음)']} placeholder="선택" />
            </Form.Item>
            <Form.Item label="감가상각기간/율" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Form.Item name="depnYear" noStyle>
                  <InputNumber precision={0} style={{ width: 70 }} disabled={isDisabled || !depnYearEnabled} />
                </Form.Item>
                <span>년 /</span>
                <Form.Item name="depnRate" noStyle>
                  <InputNumber precision={2} style={{ width: 70 }} disabled={isDisabled || !depnRateEnabled} />
                </Form.Item>
                <span>%</span>
              </div>
            </Form.Item>

            <div style={{ fontWeight: 600, margin: '14px 0 10px' }}>※ 기타정보</div>
            <Form.Item label="발행일자" name="issueDate" style={{ marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="만기일자" name="matDate" style={{ marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="거래단위" name="trUnit" style={{ marginBottom: 8 }}>
              <InputNumber precision={0} style={{ width: '100%' }} formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(v) => Number((v ?? '').replace(/,/g, ''))} />
            </Form.Item>
            {/* [E15] corpName[보관처].TriggerClick (L287) → Sys15_Lookup_Corp.open → corpId·corpName */}
            <Form.Item label="보관처" style={{ marginBottom: 8 }}>
              <Select
                open={false}
                allowClear
                placeholder="보관처 선택"
                value={corpName || undefined}
                options={corpName ? [{ value: corpName, label: corpName }] : []}
                onClick={() => setCorpOpen(true)}
                onClear={() => { setCorpName(''); form.setFieldValue('corpId', null); }}
              />
            </Form.Item>
            <Form.Item name="corpId" hidden noStyle><InputNumber /></Form.Item>
          </Form>
        </div>
      </div>

      {/* south(0.45): 내용 HtmlEditor(0.7) | 담당자 그리드(0.3) + 저장 */}
      <div style={{ flex: 45, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Splitter style={{ height: '100%' }}>
            <Splitter.Panel defaultSize="70%" style={{ paddingRight: 6, boxSizing: 'border-box' }}>
              <HtmlEditor key={editorKey} value={content} onChange={setContent} />
            </Splitter.Panel>
            <Splitter.Panel defaultSize="30%" style={{ paddingLeft: 6, boxSizing: 'border-box' }}>
              <Ast10_Grid_Manager ref={managerRef} />
            </Splitter.Panel>
          </Splitter>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* [E2] updateButton[저장].Select */}
          <Button type="save" onClick={update} disabled={isDisabled}>저장</Button>
        </div>
      </div>

      <Ast02_Lookup_Detail open={detailOpen} onClose={() => setDetailOpen(false)} onSelect={handleSelectTemplates} />

      <Ast03_Lookup_CfInfo
        open={cfOpen}
        classTreeModel={node}
        onClose={() => {
          setCfOpen(false);
          if (node) retrieve(node);
        }}
      />

      <Sys15_Lookup_Corp
        open={corpOpen}
        onResult={(corp) => {
          setCorpOpen(false);
          if (!corp) return;
          form.setFieldValue('corpId', corp.corpId);
          setCorpName(corp.corpName ?? '');
        }}
        onClose={() => setCorpOpen(false)}
      />
    </div>
  );
});

Ast02_Grid_Detail.displayName = 'Ast02_Grid_Detail';
