/**
 * 기준가 정정내역 보고 등록/수정 창 (V32) — Biz60_Tab_FundPriceModiReport의 [등록]·수정 아이콘에서 연다
 * AS-IS: myApp/client/vi/biz/Biz60_Edit_FundPriceModi.java (870줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L136-161: 새 보고는 getSeq로 번호를 먼저 받고("기준가 정정내역 보고 등록"), 고치기는 행 그대로("기준가 정정내역 보고 수정") + fileRetrieve().
 * init() L163-193: 결재 중·완료(10·20·30)이면 [저장]·[파일업로드] 비활성 + 첨부 "삭제" 열 숨김. 모달 1250×700, 라벨 폭 140, 왼쪽 입력 / 오른쪽 기준가 표·첨부.
 * 스타일: MFG 편집 팝업 → EditModal 규격(11 §4a) — 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { bizFundPriceModiApi } from '@/api/biz';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FundPriceModi } from '@/types/biz';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FileInfo>();
const FORMAT = 'YYYY-MM-DD';

/** 열 때 받는 값: 행을 주면 수정, 'new'면 새 보고 */
export type FundPriceModiEdit = FundPriceModi | 'new' | null;

interface Props {
  model: FundPriceModiEdit;
  /** AS-IS callback.execute() — 저장했을 때(저장 뒤 hide() 전) */
  onSaved: () => void;
  onClose: () => void;
}

type PriceKey = 'Price' | 'FullPrice' | 'TaxPrice' | 'FullTaxPrice' | 'ClosePrice' | 'CloseFullPrice' | 'CloseTaxPrice' | 'CloseFullTaxPrice';
/** 오른쪽 표의 줄 (L609-654): 평일 4 + 결산 4, 각각 변경전·변경후·차이값 */
const PRICE_ROWS: [PriceKey, string][] = [
  ['Price', '평일 기준가'], ['FullPrice', '평일 FULL 기준가'], ['TaxPrice', '평일 과표기준가'], ['FullTaxPrice', '평일 FULL 과표기준가'],
  ['ClosePrice', '결산 기준가'], ['CloseFullPrice', '결산 FULL 기준가'], ['CloseTaxPrice', '결산 과표기준가'], ['CloseFullTaxPrice', '결산 FULL 과표기준가'],
];
const bef = (k: PriceKey) => `bef${k}` as keyof FundPriceModi;
const aft = (k: PriceKey) => `aft${k}` as keyof FundPriceModi;

/** priceFormat `###,###,###,###,###.##` — 소수 둘째 자리까지 */
const fmt = (v: number | string | null | undefined) =>
  v == null || v === '' ? '' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });

/** 라벨 폭 140 (form.setLabelWidth(140)) · 오른쪽 정렬 */
const Field: React.FC<{ label: string; width?: number | string; children: React.ReactNode; top?: boolean }> = ({ label, width = '100%', children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', width }}>
    <Typography.Text style={{ width: 140, flex: 'none', textAlign: 'right', paddingRight: 10, lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const dayOf = (s: string | null | undefined) => (s ? dayjs(s) : null);
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Biz60_Edit_FundPriceModi: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [f, setF] = useState<Partial<FundPriceModi> | null>(null);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileForm = useRef<FileUpdownFormHandle>(null);

  // 생성자 L136-161 → init(): 새 보고는 getSeq(채번)로 번호를 먼저 받는다. [E0] 화면 열림
  useEffect(() => {
    if (model == null) { setF(null); setFiles([]); return; }
    if (model === 'new') {
      setFiles([]);
      bizFundPriceModiApi.newId()
        .then(id => setF({ fundPriceModiId: id, ksdNoticeYn: false, kofiaNoticeYn: false, fundCloseYn: false }))
        .catch(err => { message.error(errorMessage(err, '번호를 받지 못했습니다')); onClose(); });
    } else {
      // init() L167-170: 구분이 있으면 enableds(code)
      setF(enableds(model, model.reportType));
      void fileRetrieve(model.fundPriceModiId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // fileRetrieve() L514-518: 서비스 sys.Sys10_File.selectByParentId(fundPriceModiId)
  const fileRetrieve = async (id: number | undefined = f?.fundPriceModiId) => {
    if (id == null) return;
    try {
      setFiles(await fileApi.searchByParentId(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const columnDefs = useMemo(() => {
    const cols = [
      gb.text('fileNm', 350, '첨부파일'),  // L507 addTextNotSort
      iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L508 downloadCell → FileDownload?fileType=file&fileId=
        fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
      }),
      // L509 deleteCell → checkFileDelete() L520-545 (확인창 없음)
      iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => { void checkFileDelete(row); }),
      iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L510 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    ];
    // init() L175: 결재 중·완료이면 "삭제" 열(3번)을 숨긴다
    return locked(f) ? cols.filter((_, i) => i !== 2) : cols;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f?.statusCode, f?.fundPriceModiId]);

  // checkFileDelete() L520-545: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 서버 문구 / 지워도 됨(3) → FileDelete → [E19] fileDeleteForm.SubmitComplete (L356) → fileRetrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const r = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (r.status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await fileRetrieve();
      } else if (r.status === FILE_DELETE_STATUS.IN_USE) {
        message.warning(r.message ?? '해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (r.status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await fileRetrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E20] uploadButton[첨부파일].Select (L362) → upload() L396-423: 여러 파일을 고르면 [E23] fileUpload.Change (L402) → FileUpload?parentId=ID → [E24] fileUploadForm.SubmitComplete (L411) → fileRetrieve()
  const upload = async (picked: File[]) => {
    if (f?.fundPriceModiId == null || picked.length === 0) return;
    try {
      for (const file of picked) await fileApi.upload(f.fundPriceModiId, file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await fileRetrieve();
  };

  if (f == null) return null;
  const isNew = model === 'new';
  const set = <K extends keyof FundPriceModi>(k: K, v: FundPriceModi[K] | null) => setF(prev => prev && ({ ...prev, [k]: v }));
  const blocked = locked(f);

  // enableds(code) L382-394: 구분 2(기준가격변경발생보고서)이면 재발방지대책·배상액을 비우고 막는다
  const off = f.reportType === '2';

  // [E21] updateButton[저장].Select (L368) → update() L701-719 (validateFields L721-801)
  const update = async () => {
    if (!f.reportType) { message.warning('구분을 선택해주세요.'); return; }
    if (!f.modiDate) { message.warning('기준가 변경일을 입력해주세요.'); return; }
    if (!f.priceStdDate) { message.warning('기준가 산출일을 입력해주세요.'); return; }
    if (n(f.amCorpName)?.trim() == null) { message.warning('운용사를 입력해주세요.'); return; }
    if (n(f.fundName)?.trim() == null) { message.warning('펀드를 입력해주세요.'); return; }
    setSaving(true);
    try {
      await bizFundPriceModiApi.save({ ...f, fundPriceModiId: f.fundPriceModiId as number });
      onSaved();   // callback.execute() → 목록 다시 조회
      onClose();   // hide()
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const numInput = (k: keyof FundPriceModi, disabled?: boolean) => (
    <InputNumber<number>
      style={{ width: '100%' }} disabled={disabled}
      value={(f[k] as number | null | undefined) ?? null}
      formatter={(v, info) => (info.userTyping ? info.input : fmt(v))}
      parser={s => (s ? Number(s.replace(/,/g, '')) : (null as unknown as number))}
      onChange={v => set(k, v == null ? null : Number(v))}
    />
  );
  // calculateGapPrices() L841-861: 변경후 − 변경전, 둘 중 하나라도 비면 비움 (읽기 전용)
  const gap = (k: PriceKey) => {
    const b = f[bef(k)] as number | null | undefined;
    const a = f[aft(k)] as number | null | undefined;
    return b == null || a == null ? '' : fmt(a - b);
  };

  return (
    <Modal
      open
      title={isNew ? '기준가 정정내역 보고 등록' : '기준가 정정내역 보고 수정'}
      width={1250}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving} disabled={blocked}>저장</Button>
            {/* [E22] closeButton[닫기].Select (L374) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ display: 'flex', gap: 24, padding: '12px 2px' }}>
        {/* 왼쪽 (layout_l L588-597) */}
        <div style={{ flex: '0 0 600px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="구분" width={330}>
              {/* [E17] reportTypeName[구분].Collapse (L340) → enableds(code) + reportType = code */}
              <SystemCodeComboBox kindCd="FundPriceModifyReportType" placeholder="선택해주세요" style={{ width: '100%' }} value={f.reportType ?? undefined}
                onChange={code => setF(prev => prev && enableds({ ...prev, reportType: code ?? null }, code ?? null))} />
            </Field>
            <Field label="기준가 변경일" width={290}>
              <DatePicker style={{ width: '100%' }} format={FORMAT} value={dayOf(f.modiDate)} onChange={d => set('modiDate', d ? d.format(FORMAT) : null)} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="운용사" width={330}><Input value={f.amCorpName ?? ''} onChange={e => set('amCorpName', e.target.value)} /></Field>
            <Field label="기준가 산출일" width={290}>
              <DatePicker style={{ width: '100%' }} format={FORMAT} value={dayOf(f.priceStdDate)} onChange={d => set('priceStdDate', d ? d.format(FORMAT) : null)} />
            </Field>
          </div>
          <Field label="펀드"><Input value={f.fundName ?? ''} onChange={e => set('fundName', e.target.value)} /></Field>
          <Field label="최초발견자" width={330}><Input value={f.firstPersonName ?? ''} onChange={e => set('firstPersonName', e.target.value)} /></Field>
          <Field label="발견경위"><Input value={f.discCause ?? ''} onChange={e => set('discCause', e.target.value)} /></Field>
          <Field label="기준가변경사유" top><Input.TextArea rows={6} value={f.modiReason ?? ''} onChange={e => set('modiReason', e.target.value)} /></Field>
          <Field label="재발방지대책" top><Input.TextArea rows={6} disabled={off} value={f.prevPlan ?? ''} onChange={e => set('prevPlan', e.target.value)} /></Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <Field label="예탁원 공시" width={200}><Checkbox checked={!!f.ksdNoticeYn} onChange={e => set('ksdNoticeYn', e.target.checked)} /></Field>
            <Field label="협회 공시" width={200}><Checkbox checked={!!f.kofiaNoticeYn} onChange={e => set('kofiaNoticeYn', e.target.checked)} /></Field>
            <Field label="배상액" width={240}>{numInput('cmpsAmt', off)}</Field>
          </div>
        </div>

        {/* 오른쪽 (layout_r L679-686) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Field label="결산유무">
            {/* [E18] fundCloseYn[결산유무].ValueChange (L347) → 인라인(원본은 본문이 주석이라 아무 일도 하지 않는다) */}
            <Checkbox checked={!!f.fundCloseYn} onChange={e => set('fundCloseYn', e.target.checked)} />
          </Field>
          <div style={{ background: '#f5f5f5', borderRadius: 4, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
              <span /><b>변경전</b><b>변경후</b><b>차이값</b>
            </div>
            {PRICE_ROWS.map(([k, label]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
                <span style={{ textAlign: 'right', paddingRight: 6 }}>{label}</span>
                {/* [E1]~[E16] bef/aft ... Price·FullPrice·TaxPrice·FullTaxPrice·ClosePrice·CloseFullPrice·CloseTaxPrice·CloseFullTaxPrice.Change (L241-331) → calculateGapPrices() — 차이값은 렌더마다 다시 계산 */}
                {numInput(bef(k))}
                {numInput(aft(k))}
                <Input readOnly style={{ textAlign: 'right' }} value={gap(k)} />
              </div>
            ))}
          </div>
          <Field label="첨부파일">
            <Button type="upload" onClick={() => fileForm.current?.click()} disabled={blocked}>파일업로드</Button>
            <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={upload} />
          </Field>
          <div style={{ height: 150 }}>
            <SingleGrid<FileInfo> rowData={files} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} />
          </div>
        </div>
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </Modal>
  );
};

/** 결재 중·완료(10·20·30)이면 [저장]·[파일업로드]를 막고 첨부 삭제 열을 숨긴다 (init() L171-176) */
function locked(f: Partial<FundPriceModi> | null): boolean {
  return ['10', '20', '30'].includes(f?.statusCode ?? '');
}

/** enableds(code) L382-394: 구분 2이면 재발방지대책·배상액을 비운다(막는 것은 화면이 `off`로) */
function enableds<T extends Partial<FundPriceModi>>(row: T, code: string | null | undefined): T {
  return code === '2' ? { ...row, prevPlan: null, cmpsAmt: null } : row;
}
