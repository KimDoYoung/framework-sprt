# Ifi90_Tab_Config

- 종류: 화면
- 메뉴: I/F > 01. I/F 관리 > I/F 설정 (#1445)
- 파일: `client/vi/ifi/Ifi90_Tab_Config.java`
- 함께 쓰는 클래스 1개:
  - `Ifi90_Edit_Config` `client/vi/ifi/Ifi90_Edit_Config.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ifi.Ifi90_Config.delete` | Ifi90_Tab_Config:226 | [`Ifi90_Config.java:32`](../../ifi/services/Ifi90_Config.md) | [`ifi90_config.checkConfigId`](../../ifi/sql/ifi90_config.md), `UpdateDataModel(ifi90_config)` 동적 DELETE |
| `ifi.Ifi90_Config.selectByIfType` | Ifi90_Tab_Config:189 | [`Ifi90_Config.java:22`](../../ifi/services/Ifi90_Config.md) | [`ifi90_config.selectByIfType`](../../ifi/sql/ifi90_config.md) |
| `ifi.Ifi90_Config.update` | Ifi90_Edit_Config:198 | [`Ifi90_Config.java:27`](../../ifi/services/Ifi90_Config.md) | `UpdateDataModel(ifi90_config)` 동적 INSERT/UPDATE → [`ifi90_config.selectById`](../../ifi/sql/ifi90_config.md) |

## 테이블

[`ifi90_config`](../../../db/tables/ifi.md), [`ifi91_config_api`](../../../db/tables/ifi.md), [`ifi95_config_file`](../../../db/tables/ifi.md)

## DB 함수

`f_cdnm`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ifi90_Tab_Config (`client/vi/ifi/Ifi90_Tab_Config.java`, 260줄)

- 레이아웃: center=vlc, south=editConfig
- 툴바 `buttonBar`: I/F구분: {ifTypeComboBox} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `ifTypeComboBox` ComboBoxField("InterfaceType", "%", "전체"), `searchText` TextField 빈칸="IF코드/IF명/IF방식/IP/URL/비고", `editConfig` Ifi90_Edit_Config
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - ifCode 120 "I/F코드" Text
  - ifName 250 "I/F명" Text
  - ifTypeName 60 "방식" TextCenter
  - localHost 180 "HOST" Text 편집:"456EA6"
  - localPort 60 "PORT" TextCenter 편집:"456EA6"
  - localAccount 120 "계정ID" Text 편집:"456EA6"
  - localPwDec 100 "계정PW" Text 편집:"456EA6"
  - localPath 100 "Path" Text 편집:"456EA6"
  - localKey 100 "Key" Text 편집:"456EA6"
  - targetHost 180 "HOST" Text 편집:"2EAC7E"
  - targetPort 60 "PORT" TextCenter 편집:"2EAC7E"
  - targetAccount 120 "계정ID" Text 편집:"2EAC7E"
  - targetPwDec 100 "계정PW" Text 편집:"2EAC7E"
  - targetPath 100 "Path" Text 편집:"2EAC7E"
  - targetKey 100 "Key" Text 편집:"2EAC7E"
  - note 250 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L62-95) → settings()
[E1] searchText.KeyPress [Enter] (L105) → retrieve()
[E2] grid.SelectionChanged [선택>0] (L114) → retrieveEditPage()
[E3] retrieveButton[조회].Select (L123) → retrieve()
[E4] insertButton[등록].Select (L129) → insertRow()
[E5] deleteButton[삭제].Select (L135) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L220) → execute()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L50-52 | E6,retrieve | 상태 처리 | 업무 |
| private retrieveEditPage() | L170-180 | E2,retrieve | 상태 처리 | 업무 |
| public retrieve() | L183-199 | E1,E3,execute | 서비스 ifi.Ifi90_Config.selectByIfType(ifType, searchText) | 업무 |
| public update() | L202-203 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L206-209 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L212-250 | E5 | ConfirmBox → E6 | 업무 |
| private settings() | L97-141 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L143-168 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L252-254 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L256-259 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L146 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle16 100 "Local" (ifi90_new_header_group_map05new_header_group_configset_html_grid_style16 컬럼 없음)
  // ⚠DB없음 L147 newHeaderGroupMap011newHeaderGroupConfigsetHtmlGridStyle16 100 "Target" (ifi90_new_header_group_map011new_header_group_configset_html_grid_style16 컬럼 없음)
  gb.text('ifCd', 120, 'I/F코드'),  // L150
  gb.text('ifNm', 250, 'I/F명'),  // L151
  gb.textCenter('ifTypeNm', 60, '방식'),  // L152 SQL 계산 컬럼(selectByIfType: f_cdnm('InterfaceType', ifi90_if_type, …)
  gb.text('localHost', 180, 'HOST'),  // L153
  gb.textCenter('localPort', 60, 'PORT'),  // L154
  gb.text('localAccount', 120, '계정ID'),  // L155
  gb.text('localPwDec', 100, '계정PW'),  // L156 SQL 계산 컬럼(selectByIfType: to_decrypts(ifi90_local_pw))
  gb.text('localPath', 100, 'Path'),  // L157
  gb.text('localKey', 100, 'Key'),  // L158
  gb.text('targetHost', 180, 'HOST'),  // L159
  gb.textCenter('targetPort', 60, 'PORT'),  // L160
  gb.text('targetAccount', 120, '계정ID'),  // L161
  gb.text('targetPwDec', 100, '계정PW'),  // L162 SQL 계산 컬럼(selectByIfType: to_decrypts(ifi90_target_pw))
  gb.text('targetPath', 100, 'Path'),  // L163
  // ⚠DB없음 L164 targetKey 100 "Key" (ifi90_target_key 컬럼 없음)
  gb.textArea('note', 250, '비고'),  // L165
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ifi90_Edit_Config (`client/vi/ifi/Ifi90_Edit_Config.java`, 216줄)

- 입력·하위 화면: `ifCode` TextField, `ifName` TextField, `ifType` TextField, `ifTypeName` ComboBoxField("InterfaceType"), `localHost` TextField, `localPort` TextField, `localAccount` TextField, `localPwDec` TextField, `localPath` TextField, `localKey` TextField, `targetHost` TextField, `targetPort` TextField, `targetAccount` TextField, `targetPwDec` TextField, `targetPath` TextField, `targetKey` TextField, `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L68-93) → getEditor()
[E1] updateButton[저장].Select (L87) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L95-166 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L168-175 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L177-179 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L181-210 | E1 | 서비스 ifi.Ifi90_Config.update | 업무 |
| private setHtmlStyle() | L212-214 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

