# Pay08_Tab_TaxWithholdingAdmin

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 원천징수영수증 업로드 (#1220)
- 파일: `client/vi/pay/Pay08_Tab_TaxWithholdingAdmin.java`
- 함께 쓰는 클래스 1개:
  - `Pay08_PDFViewer` `client/vi/pay/Pay08_PDFViewer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay08_TaxWithholding.delete` | Pay08_Tab_TaxWithholdingAdmin:296 | [`Pay08_TaxWithholding.java:50`](../../pay/services/Pay08_TaxWithholding.md) | `UpdateDataModel(pay08_tax_withholding)` 동적 DELETE |
| `pay.Pay08_TaxWithholding.update` | Pay08_Tab_TaxWithholdingAdmin:357 | [`Pay08_TaxWithholding.java:45`](../../pay/services/Pay08_TaxWithholding.md) | `UpdateDataModel(pay08_tax_withholding)` 동적 INSERT/UPDATE → [`pay08_tax_withholding.selectById`](../../pay/sql/pay08_tax_withholding.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Pay08_Tab_TaxWithholdingAdmin:274 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`pay08_tax_withholding`](../../../db/tables/pay.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay08_Tab_TaxWithholdingAdmin (`client/vi/pay/Pay08_Tab_TaxWithholdingAdmin.java`, 363줄)

- 레이아웃: west=vlc, center=viewer, center=blc
- 툴바 `buttonBar`: 사원명: {personName} {retrieveButton} {updateButton} {uploadButton} {fileUploadForm}
- 입력·하위 화면: `personName` LookupTriggerField, `personId` LongField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - fileName 350 "파일명" Text
  - personName 100 "사원명" TextCenter 편집:personName
  - note 300 "비고" Text 편집:TextField
  - actionCell 30 "" Cell 편집:downloadCell
  - actionCell 30 "" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L76-148) → settings(), retrieve()
[E1] fileUpload.Change (L84) → 인라인 L84-91 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L94) → resetFileUpload(), retrieve()
[E3] fileDeleteForm.SubmitComplete (L105) → retrieve()
[E4] personName.TriggerClick [result == null] (L153) → 인라인 L153-172 (new TriggerClickHandler(){ @Override …)
[E5] retrieveButton[조회].Select (L173) → retrieve()
[E6] updateButton[저장].Select (L179) → update()
[E7] uploadButton[파일업로드].Select (L185) → 인라인 L185-190 (new SelectHandler() { @Override publi…)
[E8] grid.CellClick (L192) → 인라인 L192-204 (new CellClickHandler() { @Override pu…)
[E9] personName.TriggerClick (L212) → 인라인 L212-227 (new TriggerClickHandler(){ @Override …)
[E10] msgBox.DialogHide [YES] (L243) → checkFileDelete()
[E11] fileUpload.Change (L345) → 인라인 L345-352 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private checkFileDelete() | L271-300 | E10 | GridDeleteData sys.Sys11_RelateFile.checkFileDelete, pay.Pay08_TaxWithholding.delete(체크된 행 목록) | 업무 |
| public retrieve() | L302-336 | 생성자,E2,E3,E5,checkFileDelete | 상태 처리 | 업무 |
| private resetFileUpload() | L338-353 | E2 | 상태 처리 | 업무 |
| public update() | L355-358 | E6 | 서비스 pay.Pay08_TaxWithholding.update | 업무 |
| private settings() | L150-205 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: personName=null, personId=null, personName=empTransInfoModel.getEmpPersonModel(, personId=empTransInfoModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L207-269 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L360-362 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 350, '파일명'),  // L262 SQL 계산 컬럼(selectById: sys10_file_nm)
  gb.textCenter('personNm', 100, '사원명'),  // L263 SQL 계산 컬럼(selectById: COALESCE(emp01_kor_nm,'-'))
  gb.text('note', 300, '비고', { editor: 'text' }),  // L264
  // ⚠ 대응 없음 (GridBuilder L265) addCell
  // ⚠ 대응 없음 (GridBuilder L266) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="upload" onClick={() => /* 인라인 L185-190 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

### Pay08_PDFViewer (`client/vi/pay/Pay08_PDFViewer.java`, 69줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L34-68 | view | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

