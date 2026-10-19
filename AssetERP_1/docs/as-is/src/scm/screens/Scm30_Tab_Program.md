# Scm30_Tab_Program

- 종류: 화면
- 메뉴: KFS > 03. 프로그램 관리 > 프로그램 관리 (#1265)
- 파일: `client/vi/scm/Scm30_Tab_Program.java`
- 함께 쓰는 클래스 3개:
  - `Scm30_Lookup_Program` `client/vi/scm/Scm30_Lookup_Program.java`
  - `Scm30_Lookup_MultiUpload` `client/vi/scm/Scm30_Lookup_MultiUpload.java`
  - `Scm30_Edit_Program` `client/vi/scm/Scm30_Edit_Program.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `scm.Scm30_Program.modelUpdate` | Scm30_Edit_Program:398 | [`Scm30_Program.java:86`](../../scm/services/Scm30_Program.md) | [`scm30_program.selectById`](../../scm/sql/scm30_program.md), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE → [`scm30_program.selectById`](../../scm/sql/scm30_program.md) |
| `scm.Scm30_Program.selectByPaging` | Scm30_Tab_Program:85 | [`Scm30_Program.java:40`](../../scm/services/Scm30_Program.md) | [`scm30_program.selectByCompanyIdPaging`](../../scm/sql/scm30_program.md), [`scm30_program.selectByCompanyIdTotal`](../../scm/sql/scm30_program.md) |
| `scm.Scm30_Program.selectBySystemCode` | Scm30_Lookup_Program:192 | [`Scm30_Program.java:64`](../../scm/services/Scm30_Program.md) | [`scm30_program.selectBySystemCode`](../../scm/sql/scm30_program.md) |
| `sys.Sys10_File.selectByParentId` | Scm30_Edit_Program:249, Scm30_Edit_Program:365 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm30_Tab_Program (`client/vi/scm/Scm30_Tab_Program.java`, 287줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 시스템: {systemCode} 구분: {programType} 사용여부: {useYnName} 검색: {searchText} {retrieveButton} {insertButton} {fileMultiUploadButton} {fileDownloadForm}
- 입력·하위 화면: `searchText` TextField 빈칸="구분/프로그램ID/프로그램명/파일명/비고", `systemCode` ComboBoxField("SystemCode"), `useYnName` StringComboBox, `programType` ComboBoxField("ProgramType", "%", "전체", "전체"), `popup` Scm30_Edit_Program, `Lookup` Scm30_Lookup_Program
- 그리드 `grid` (buildGrid()):
  - systemName 100 "시스템" Text
  - programTypeName 100 "구분" Text
  - programCode 250 "프로그램ID" Text
  - programName 350 "프로그램명" Text
  - actionCell 70 "소스보기" Cell 편집:sourceViewCell
  - actionCell 70 "파일다운" Cell 편집:downloadCell
  - version 40 "버전" LongCenter
  - actionCell 30 "" Cell 편집:versionViewCell
  - regDateStr 150 "최종변경일시" Text
  - note 330 "비고" Text
  - useYn 70 "사용여부" BooleanString

#### 이벤트
[E0] 화면 열림 (생성자 L55-96) → settings()
[E1] searchText.KeyPress [Enter] (L128) → retrieve()
[E2] retrieveButton[조회].Select (L137) → retrieve()
[E3] insertButton[등록].Select (L143) → insertRow()
[E4] fileMultiUploadButton[파일일괄등록].Select (L149) → fileMultiUpload()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L219-264 | E1,E2,fileMultiUpload | 상태 처리 | 업무 |
| public insertRow() | L266-272 | E3 | 팝업 Scm30_Edit_Program 열기 | 업무 |
| public fileMultiUpload() | L274-281 | E4 | 조회창 Scm30_Lookup_MultiUpload 열기 | 업무 |
| private settings() | L98-156 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L158-217 | 필드 초기화 | 팝업 Scm30_Edit_Program 열기, 조회창 Scm30_Lookup_Program 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L283-285 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('systemNm', 100, '시스템'),  // L204 SQL 계산 컬럼(selectByCompanyIdPaging: f_cdnm('SystemCode', scm30_system_cd, #…)
  gb.text('programTypeNm', 100, '구분'),  // L205 SQL 계산 컬럼(selectByCompanyIdPaging: f_cdnm('ProgramType', scm30_program_typ…)
  gb.text('programCd', 250, '프로그램ID'),  // L206
  gb.text('programNm', 350, '프로그램명'),  // L207
  // ⚠ 대응 없음 (GridBuilder L208) addCell
  // ⚠ 대응 없음 (GridBuilder L209) addCell
  gb.longCenter('version', 40, '버전'),  // L210
  // ⚠ 대응 없음 (GridBuilder L211) addCell
  gb.text('regDateStr', 150, '최종변경일시'),  // L212 SQL 계산 컬럼(selectByCompanyIdPaging: to_char(scm30_reg_date, 'YYYY-MM-DD HH2…)
  gb.text('note', 330, '비고'),  // L213
  // ⚠ 대응 없음 (GridBuilder L214) addBooleanString
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={fileMultiUpload}>파일일괄등록</Button>

### Scm30_Lookup_Program (`client/vi/scm/Scm30_Lookup_Program.java`, 208줄)

- 툴바 `buttonBar`: 시스템: {systemCode} 구분: {programType} 프로그램ID: {programCode} {fileDownloadForm}
- 입력·하위 화면: `systemCode` TextField, `programType` TextField, `programCode` TextField, `popup` Scm30_Edit_Program
- 그리드 `grid` (buildGrid()):
  - programName 350 "프로그램명" Text
  - personName 100 "등록자" Text
  - regDateStr 150 "등록일시" Text
  - deployDateStr 150 "배포일시" Text
  - version 40 "버전" Long
  - actionCell 70 "소스보기" Cell 편집:sourceViewCell
  - actionCell 70 "파일다운" Cell 편집:downloadCell
  - note 330 "비고" Text
  - useYn 70 "사용여부" BooleanString

#### 이벤트
[E0] 화면 열림 (생성자 L60-89) → settings(), show()
[E1] closeButton[닫기].Select (L98) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L47-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L159-198 | open | 서비스 scm.Scm30_Program.selectBySystemCode(companyId, systemCode, programType, programCode) | 업무 |
| private settings() | L91-106 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L109-157 | 필드 초기화 | 팝업 Scm30_Edit_Program 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L200-202 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L204-206 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('programNm', 350, '프로그램명'),  // L146
  gb.text('personNm', 100, '등록자'),  // L147 SQL 계산 컬럼(selectBySystemCode: f_emp_kor_nm(scm30_person_id))
  gb.text('regDateStr', 150, '등록일시'),  // L148 SQL 계산 컬럼(selectBySystemCode: to_char(scm30_reg_date, 'YYYY-MM-DD HH2…)
  gb.text('deployDateStr', 150, '배포일시'),  // L149 SQL 계산 컬럼(selectBySystemCode: to_char(scm13_deploy_date, 'YYYY-MM-DD …)
  gb.long('version', 40, '버전'),  // L150
  // ⚠ 대응 없음 (GridBuilder L151) addCell
  // ⚠ 대응 없음 (GridBuilder L152) addCell
  gb.text('note', 330, '비고'),  // L153
  // ⚠ 대응 없음 (GridBuilder L154) addBooleanString
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm30_Lookup_MultiUpload (`client/vi/scm/Scm30_Lookup_MultiUpload.java`, 148줄)

- 입력·하위 화면: `systemCode` ComboBoxField("SystemCode") 빈칸="선택", `programType` ComboBoxField("ProgramType") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L46-104) → show()
[E1] fileUpload.Change (L59) → 인라인 L59-72 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L77) → hide()
[E3] updateButton[업로드].Select (L86) → uploadChk()
[E4] closeButton[닫기].Select (L92) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-44 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L106-124 | open | 상태 처리 | 업무 |
| public uploadChk() | L126-137 | E3 | 상태 처리 | 업무 |
| private setHtmlStyle() | L140-142 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L144-146 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={uploadChk}>업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm30_Edit_Program (`client/vi/scm/Scm30_Edit_Program.java`, 465줄)

- 입력·하위 화면: `systemCode` TextField, `programType` TextField, `systemName` ComboBoxField("SystemCode"), `programTypeName` ComboBoxField("ProgramType"), `programCode` TextField, `programName` TextField 빈칸="미입력시 전버전의 프로그램명으로 등록됩니다.", `version` LongField, `source` MyTextArea, `note` MyTextArea, `useYn` CheckBox, `regDateStr` TextField 빈칸="(자동생성)", `fileName` TextField, `versionName` TextField 빈칸="(자동생성)"

#### 이벤트
[E0] 화면 열림 (생성자 L195-305) → getEditor(), show()
[E1] fileUpload.Change (L218) → 인라인 L218-225 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L228) → resetFileUpload(), fileRetrieve()
[E3] fileDeleteForm.SubmitComplete (L235) → 인라인 L235-240 (new SubmitCompleteHandler() { @Overri…)
[E4] uploadButton[파일업로드].Select [result.getStatus() <= 0] (L245) → 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다."
[E5] downloadButton[다운로드].Select (L266) → fileDownload()
[E6] deleteButton[삭제].Select (L272) → fileDelete()
[E7] updateButton[저장].Select (L278) → update()
[E8] closeButton[닫기].Select [versionCode == 1] (L284) → hide()
[E9] fileUpload.Change (L448) → 인라인 L448-455 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L91-107 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L109-133 | 공개 메서드 | 상태 처리 | 업무 |
| public versionEdit() | L135-159 | 공개 메서드 | 상태 처리 | 업무 |
| public read() | L161-186 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L188-193 | insert,edit,versionEdit,read | 상태 처리 | 업무 |
| private getEditor() | L307-362 | 생성자 | 상태 처리 | 업무 |
| private fileRetrieve() | L364-380 | E2,edit,read | 서비스 sys.Sys10_File.selectByParentId | 업무 |
| private update() | L382-419 | E7 | 서비스 scm.Scm30_Program.modelUpdate(versionCode) | 업무 |
| private fileDownload() | L421-429 | E5 | 상태 처리 | 업무 |
| private fileDelete() | L431-439 | E6 | 상태 처리 | 업무 |
| private resetFileUpload() | L441-456 | E2 | 상태 처리 | 업무 |
| private setHtmlStyle() | L458-460 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L462-464 | insert,edit,versionEdit,read | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다." */}>파일업로드</Button>
2. <Button type="download" onClick={fileDownload}>다운로드</Button>
3. <Button type="delete" onClick={fileDelete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

