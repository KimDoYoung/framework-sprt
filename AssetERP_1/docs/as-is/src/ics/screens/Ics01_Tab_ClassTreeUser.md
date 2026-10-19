# Ics01_Tab_ClassTreeUser

- 종류: 화면
- 메뉴: 준법감시 > 01. 법규관리 > 법규관리 (#1013)
- 파일: `client/vi/ics/Ics01_Tab_ClassTreeUser.java`
- 함께 쓰는 클래스 8개:
  - `Ics20_Lookup_RevisionHistory` `client/vi/ics/Ics20_Lookup_RevisionHistory.java`
  - `Ics20_Lookup_File` `client/vi/ics/Ics20_Lookup_File.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`
  - `Ics02_Lookup_Manager` `client/vi/ics/Ics02_Lookup_Manager.java`
  - `Ics01_Lookup_Share` `client/vi/ics/Ics01_Lookup_Share.java`
  - `Ics01_Lookup_IcsFile` `client/vi/ics/Ics01_Lookup_IcsFile.java`
  - `Ics01_Lookup_IcsFileAdmin` `client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`
  - `Ics01_Lookup_Except` `client/vi/ics/Ics01_Lookup_Except.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_Content`](../../ics/components/Ics01_Lookup_Content.md), [`Ics01_Lookup_SelectParent`](../../ics/components/Ics01_Lookup_SelectParent.md), [`Sch03_Lookup_IcsUser`](../../sch/components/Sch03_Lookup_IcsUser.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Ics01_Lookup_Except:299, Ics01_Tab_ClassTreeUser:319 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ics.Ics01_ClassTree.refresh` | Ics01_Tab_ClassTreeUser:444 | [`Ics01_ClassTree.java:264`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.refresh`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByExcept` | Ics01_Lookup_Except:268 | [`Ics01_ClassTree.java:163`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByExcept`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByTypeCodePaging` | Ics01_Tab_ClassTreeUser:104 | [`Ics01_ClassTree.java:96`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByTypeCodePaging`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.selectByTypeCodePagingTotal`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics02_Manager.getDefaultYn` | Ics01_Lookup_Share:113 | [`Ics02_Manager.java:54`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.getDefaultYn`](../../ics/sql/ics02_manager.md) |
| `ics.Ics02_Manager.selectByCompanyId` | Ics02_Lookup_Manager:112 | [`Ics02_Manager.java:28`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.selectByCompanyId`](../../ics/sql/ics02_manager.md) |
| `ics.Ics03_CompanyInfo.modelUpdate` | Ics01_Lookup_Except:319, Ics01_Tab_ClassTreeUser:340 | [`Ics03_CompanyInfo.java:37`](../../ics/services/Ics03_CompanyInfo.md) | `UpdateDataModel(ics03_company_info)` 동적 INSERT/UPDATE → [`ics03_company_info.selectById`](../../ics/sql/ics03_company_info.md) |
| `ics.Ics03_CompanyInfo.selectByClassTreeId` | Ics01_Lookup_Except:284, Ics01_Tab_ClassTreeUser:303 | [`Ics03_CompanyInfo.java:26`](../../ics/services/Ics03_CompanyInfo.md) | [`ics03_company_info.selectByClassTreeId`](../../ics/sql/ics03_company_info.md) |
| `ics.Ics04_Share.selectByManagerId` | Ics01_Lookup_Share:246 | [`Ics04_Share.java:25`](../../ics/services/Ics04_Share.md) | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md) |
| `ics.Ics05_RelateManager.relateUpdate` | Ics01_Lookup_Share:222 | [`Ics05_RelateManager.java:37`](../../ics/services/Ics05_RelateManager.md) | [`ics01_class_tree.refresh`](../../ics/sql/ics01_class_tree.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`ics05_relate_manager.delete`](../../ics/sql/ics05_relate_manager.md), [`ics05_relate_manager.insert`](../../ics/sql/ics05_relate_manager.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) |
| `ics.Ics05_RelateManager.selectByClassTreeId` | Ics01_Lookup_Share:96 | [`Ics05_RelateManager.java:28`](../../ics/services/Ics05_RelateManager.md) | [`ics05_relate_manager.selectByClassTreeId`](../../ics/sql/ics05_relate_manager.md) |
| `ics.Ics20_RevisionHistory.selectByClassTreeId` | Ics20_Lookup_RevisionHistory:137 | [`Ics20_RevisionHistory.java:48`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByClassTreeId`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |
| `sys.Sys10_File.getIcsFile` | Ics01_Lookup_IcsFileAdmin:157 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Ics20_Lookup_File:105 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Ics01_Lookup_IcsFile:179 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.insert` | Ics01_Lookup_IcsFile:213 | [`Sys11_RelateFile.java:143`](../../sys/services/Sys11_RelateFile.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.insertCheck`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys11_RelateFile.selectByParentId` | Ics01_Lookup_IcsFile:197 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics04_share`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_ClassTreeUser (`client/vi/ics/Ics01_Tab_ClassTreeUser.java`, 484줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 분류: {classTreeName} 관리그룹: {mngGroupName} {retrieveButton} {updateButton} {exceptButton} {mngGroupButton}
- 툴바 `buttonBar2`: 법규검색: {lawSearch} 조문검색: {statuteSearch} {detailSearchCheckBox} {advisCheckBox}
- 입력·하위 화면: `classTreeName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `detailSearchCheckBox` CheckBox, `advisCheckBox` CheckBox, `lawSearch` TextField 빈칸="법규코드/법규명", `statuteSearch` TextField 빈칸="관련조문", `mngGroupName` LookupTriggerField 빈칸="전체", `mngGroupId` LongField, `mnaGroupLookup` Ics02_Lookup_Manager, `lookup` Ics01_Lookup_Content, `lookupDeadline` Sch03_Lookup_IcsUser, `lookupShare` Ics01_Lookup_Share, `lookupFile` Ics01_Lookup_IcsFile, `lookupRevisionHistory` Ics20_Lookup_RevisionHistory, `lookupExcept` Ics01_Lookup_Except
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 70 "법규코드" TextCenter
  - classTreeName 200 "법규명" TextArea
  - content 300 "상세내용" TextLimitArea
  - actionCell 30 " " Cell 편집:actionCell
  - submitTo 150 "제출처" TextArea
  - relatedLaw 200 "관련조문" TextArea
  - revisionCount 60 "개정이력" TextCenter
  - actionCell 30 " " Cell 편집:revisionCell
  - cycleName 100 "주기" Text
  - actionCell 30 " " Cell 편집:deadlineCell
  - fileCount 60 "서식파일" TextCenter
  - actionCell 30 " " Cell 편집:fileAddCell
  - parentTreeFullName 200 "분류" TextArea
  - advisYn 50 "일임<br>(자문)" Boolean 편집:"456EA6"
  - managerGroupName 120 "관리그룹" Text 편집:"456EA6"
  - actionCell 30 " " Cell 편집:managerCell
  - exceptYn 60 "제외" Boolean 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L73-121) → settings(), retrieve()
[E1] classTreeName.TriggerClick [result == null] (L129) → 인라인 L129-147 (new TriggerClickHandler(){ @Override …)
[E2] mngGroupName.TriggerClick [result == null] (L152) → 인라인 L152-170 (new TriggerClickHandler() { @Override…)
[E3] lawSearch.KeyPress [Enter] (L174) → retrieve()
[E4] statuteSearch.KeyPress [Enter] (L185) → retrieve()
[E5] retrieveButton[조회].Select (L200) → retrieve()
[E6] updateButton[저장].Select (L206) → updateCheck()
[E7] exceptButton[사용여부 일괄설정].Select (L212) → lookupExcept()
[E8] mngGroupButton[관리그룹 일괄지정].Select (L218) → lookupManagerGroup()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private updateCheck() | L295-337 | E6 | 서비스 ics.Ics03_CompanyInfo.selectByClassTreeId | 업무 |
| private update() | L339-349 | updateCheck | 서비스 ics.Ics03_CompanyInfo.modelUpdate | 업무 |
| private retrieve() | L351-376 | 생성자,E3,E4,E5,update,lookupExcept | 상태 처리 | 업무 |
| private contentView() | L378-386 | buildGrid | 조회창 Ics01_Lookup_Content 열기 | 업무 |
| private deadlineList() | L388-391 | buildGrid | 조회창 Sch03_Lookup_IcsUser 열기 | 업무 |
| private lookupManagerGroup() | L393-406 | E8,buildGrid | 조회창 Ics01_Lookup_Share 열기 | 업무 |
| private lookupManagerGroup() | L408-426 | E8,buildGrid | 조회창 Ics01_Lookup_Share 열기, 미선택 시 alert "관리그룹을 지정할 법규를 선택하세요" | 업무 |
| private fileAddList() | L428-436 | buildGrid | 조회창 Ics01_Lookup_IcsFile 열기 | 업무 |
| private revisionList() | L438-441 | buildGrid | 조회창 Ics20_Lookup_RevisionHistory 열기 | 업무 |
| private refresh() | L443-461 | fileAddList | 서비스 ics.Ics01_ClassTree.refresh(classTreeId, companyId) | 업무 |
| private lookupExcept() | L463-471 | E7 | 조회창 Ics01_Lookup_Except 열기 | 업무 |
| private settings() | L123-224 | 생성자 | 조회창 Ics01_Lookup_SelectParent 열기, 조회창 Ics02_Lookup_Manager 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeName=null, classTreeId=null, classTreeName=resultModel.getClassTreeFullName(, classTreeId=resultModel.getClassTreeId(, mngGroupId=null, mngGroupName=null, mngGroupId=model.getManagerId(, mngGroupName=model.getManagerGroupName(, detailSearchCheckBox=false("상세내용 포함"), advisCheckBox=false | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L226-293 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L473-475 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L477-479 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L481-483 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 70, '법규코드'),  // L273
  gb.textArea('classTreeNm', 200, '법규명'),  // L274
  // ⚠ 대응 없음 (GridBuilder L275) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L276) addCell
  gb.textArea('submitTo', 150, '제출처'),  // L277
  gb.textArea('relatedLaw', 200, '관련조문'),  // L278
  gb.textCenter('revisionCount', 60, '개정이력'),  // L279
  // ⚠ 대응 없음 (GridBuilder L280) addCell
  gb.text('cycleNm', 100, '주기'),  // L281
  // ⚠ 대응 없음 (GridBuilder L282) addCell
  gb.textCenter('fileCount', 60, '서식파일'),  // L283
  // ⚠ 대응 없음 (GridBuilder L284) addCell
  gb.textArea('parentTreeFullNm', 200, '분류'),  // L285
  gb.boolean('advisYn', 50, '일임<br>(자문)'),  // L286
  gb.text('managerGroupNm', 120, '관리그룹'),  // L287
  // ⚠ 대응 없음 (GridBuilder L288) addCell
  gb.boolean('exceptYn', 60, '제외'),  // L290
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateCheck}>저장</Button>
3. <Button type="save" onClick={lookupExcept}>사용여부 일괄설정</Button>
4. <Button type="save" onClick={lookupManagerGroup}>관리그룹 일괄지정</Button>

### Ics20_Lookup_RevisionHistory (`client/vi/ics/Ics20_Lookup_RevisionHistory.java`, 148줄)

- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookupContent` Ics20_Lookup_Content, `lookupFile` Ics20_Lookup_File
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - title 450 "법규명" Text
  - actionCell 60 "상세내용" Cell 편집:ContentCell
  - financeAgencyName 100 "소관부처" Text
  - reflectionDate 90 "법규반영일" Date
  - fileCount 60 "첨부파일" LongCenter
  - actionCell 30 " " Cell 편집:fileListCell

#### 이벤트
[E0] 화면 열림 (생성자 L40-42) → 초기화
[E1] anchor.MouseDown (L59) → retrieve()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L134-138 | E1,open | 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId(classTreeId) | 업무 |
| private fileList() | L140-143 | buildGrid | 조회창 Ics20_Lookup_File 열기 | 업무 |
| private makeLayout() | L50-87 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L90-132 | 필드 초기화 | 조회창 Ics20_Lookup_Content 열기, 미선택 시 alert "첨부파일이 없습니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L145-147 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L121
  gb.date('submissionDate', 90, '의견제출일'),  // L122
  gb.date('effectDate', 90, '시행일'),  // L123
  gb.text('title', 450, '법규명'),  // L124
  // ⚠ 대응 없음 (GridBuilder L125) addCell
  gb.text('financeAgencyNm', 100, '소관부처'),  // L126
  gb.date('reflectionDate', 90, '법규반영일'),  // L127
  gb.longCenter('fileCount', 60, '첨부파일'),  // L128
  // ⚠ 대응 없음 (GridBuilder L129) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_File (`client/vi/ics/Ics20_Lookup_File.java`, 117줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 440 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] closeButton[닫기].Select (L46) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-65 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L67-97 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L99-111 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L113-115 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일명'),  // L92
  // ⚠ 대응 없음 (GridBuilder L93) addCell
  // ⚠ 대응 없음 (GridBuilder L94) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_Content (`client/vi/ics/Ics20_Lookup_Content.java`, 102줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-96 | E1 | 서비스 ics.Ics20_RevisionHistory.updateContent | 업무 |
| private setHtmlHeaderStyle() | L98-100 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics02_Lookup_Manager (`client/vi/ics/Ics02_Lookup_Manager.java`, 148줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - managerGroupName 320 "관리그룹명" Text

#### 이벤트
[E1] oKButton[확인].Select (L69) → confirm()
[E2] allButton[전체].Select [callback != null] (L75) → hide()
[E3] cancelButton[닫기].Select (L84) → hide()
[E4] grid.CellDoubleClick (L90) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-42 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L44-66 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L68-96 | open | 상태 처리 | 업무 |
| public retrieve() | L109-118 | open | 서비스 ics.Ics02_Manager.selectByCompanyId(companyId) | 업무 |
| public confirm() | L120-132 | E1,E4 | 미선택 시 alert "관리그룹을 선택해주세요" | 업무 |
| public getServiceResult() | L135-143 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L98-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L145-147 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('managerGroupNm', 320, '관리그룹명'),  // L103
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>전체</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_Share (`client/vi/ics/Ics01_Lookup_Share.java`, 260줄)

- 입력·하위 화면: `personName` TextField, `managerGroupName` LookupTriggerField 빈칸="선택하세요", `lookup` Ics02_Lookup_Manager
- 그리드 `grid` (grid()):
  - shareName 80 "구분" TextCenter
  - orgName 250 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L82-93) → getEditor(), show()
[E1] updateButton[저장].Select (L134) → update()
[E2] closeButton[닫기].Select [callback != null] (L140) → hide()
[E3] managerGroupName[관리그룹].TriggerClick (L155) → shareRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-66 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L68-73 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L75-80 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L95-131 | open | 서비스 ics.Ics05_RelateManager.selectByClassTreeId, ics.Ics02_Manager.getDefaultYn | 업무 |
| private setting() | L133-176 | open | 조회창 Ics02_Lookup_Manager 열기 | 업무 |
| private grid() | L178-185 | 필드 초기화 | 상태 처리 | 업무 |
| private getEditor() | L187-198 | 생성자 | 상태 처리 | 업무 |
| public update() | L200-240 | E1 | 서비스 ics.Ics05_RelateManager.relateUpdate | 업무 |
| private shareRetrieve() | L242-251 | E3,retrieve | 서비스 ics.Ics04_Share.selectByManagerId(companyId, managerId) | 업무 |
| private setHtmlStyle() | L253-255 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 80, '구분'),  // L180 SQL 계산 컬럼(selectByManagerId: f_cdnm('ShareCode', ics04_share_cd, ics…)
  gb.text('orgNm', 250, '부서'),  // L181 SQL 계산 컬럼(selectByManagerId: f_org_nm(ics04_org_id, f_sysdate()))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_IcsFile (`client/vi/ics/Ics01_Lookup_IcsFile.java`, 268줄)

- 입력·하위 화면: `listLookup` Ics01_Lookup_IcsFileAdmin
- 그리드 `grid` (buildApprFileGrid(), 체크박스):
  - fileName 580 "서식파일" Text
  - regDate 100 "등록일" Date
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] okButton[닫기].Select (L94) → confirm()
[E2] listButton[불러오기].Select (L100) → listLookup()
[E3] fileUpload.Change (L115) → 인라인 L115-122 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L125) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L146) → retrieve()
[E6] fileUpload.Change (L243) → 인라인 L243-250 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L60-65 | 공개 메서드 | 상태 처리 | 업무 |
| public openPeriod() | L68-78 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L80-86 | openUser | 상태 처리 | 업무 |
| public setting() | L88-158 | openPeriod,open | 상태 처리 | 업무 |
| private buildApprFileGrid() | L160-190 | 필드 초기화 | GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private retrieve() | L192-203 | E4,E5,setting,listLookup | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| private listLookup() | L205-227 | E2 | 조회창 Ics01_Lookup_IcsFileAdmin 열기, 서비스 sys.Sys11_RelateFile.insert(relateId, tableName) | 업무 |
| private confirm() | L229-234 | E1 | 상태 처리 | 업무 |
| private resetFileUpload() | L236-251 | E4 | 상태 처리 | 업무 |
| public getServiceResult() | L254-262 | listLookup | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L264-266 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 580, '서식파일'),  // L184 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  gb.date('regDate', 100, '등록일'),  // L185 SQL 계산 컬럼(selectByParentId: sys10_reg_date)
  // ⚠ 대응 없음 (GridBuilder L186) addCell
  // ⚠ 대응 없음 (GridBuilder L187) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={listLookup}>불러오기</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

### Ics01_Lookup_IcsFileAdmin (`client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`, 196줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="법령구분/내용/서식파일"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "등록일" Date
  - lawName 150 "법령구분" Text
  - note 150 "내용" Text
  - fileName 350 "서식파일" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L58-87) → Settings(), show(), retrieve()
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] confirmButton[확인].Select (L109) → confirm()
       └ [E5] msgBox.DialogHide [YES] (L170) → hide()
[E4] closeButton[닫기].Select (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public Settings() | L89-121 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L148-163 | 생성자,E1,E2 | 서비스 sys.Sys10_File.getIcsFile(parentId, lawType, searchText, firstRegDateYn) | 업무 |
| private confirm() | L165-187 | E3 | ConfirmBox → E5 | 업무 |
| private buildGrid() | L123-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L139
  gb.text('lawNm', 150, '법령구분'),  // L140 SQL 계산 컬럼(getIcsFile: f_cdnm('LawType', sys10_law_type, 0, f_…)
  gb.text('note', 150, '내용'),  // L141
  gb.text('fileNm', 350, '서식파일'),  // L142
  // ⚠ 대응 없음 (GridBuilder L143) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_Except (`client/vi/ics/Ics01_Lookup_Except.java`, 366줄)

- 툴바 `buttonBar`: 분류: {classTreeName} 사용여부: {exceptYnComboBox} 검색: {searchText} {detailSearchCheckBox} {retrieveButton} {updateButton} {selectAllButton} {releaseAllButton}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `classTreeId` LongField, `cycleComboBox` ComboBoxField("CycleCode", "%", "전체"), `exceptYnComboBox` StringComboBox, `searchText` TextField 빈칸="분류코드/분류명", `detailSearchCheckBox` CheckBox, `lookupDeadline` Sch03_Lookup_IcsUser, `lookupDetail` Ics01_Lookup_ClassTreeDetail
- 그리드 `grid` (buildGrid()):
  - actionCell 30 "" Cell 편집:detailCell
  - classTreeCode 100 "분류코드" TextCenter
  - classTreeFullName 780 "분류명" Text
  - cycleName 150 "주기" Text
  - exceptYn 80 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L85-125) → show()
[E1] classTreeName[전체].TriggerClick [result == null] (L151) → execute()
[E2] exceptYnComboBox[전체].Collapse (L176) → retrieve()
[E3] selectAllButton[전체선택].Select (L188) → selectAll()
[E4] releaseAllButton[전체해제].Select (L194) → releaseAll()
[E5] retrieveButton[조회].Select (L200) → retrieve()
[E6] updateButton[저장].Select (L206) → update()
[E7] cancleButton[닫기].Select (L212) → hide()
[E8] searchText.KeyPress [Enter] (L219) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L71-73 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| public open() | L79-83 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L127-227 | open | 조회창 Ics01_Lookup_SelectParent 열기 | 업무 |
| public retrieve() | L247-274 | E2,E5,E8,execute,update | 서비스 ics.Ics01_ClassTree.selectByExcept(companyId, cycleCode, classTreeId, typeCode, exceptYn, searchText, detailSearchYn) | 업무 |
| private update() | L276-316 | E6 | 서비스 ics.Ics03_CompanyInfo.selectByClassTreeId | 업무 |
| private update() | L318-328 | E6 | 서비스 ics.Ics03_CompanyInfo.modelUpdate | 업무 |
| private selectAll() | L330-335 | E3 | 상태 처리 | 업무 |
| private releaseAll() | L337-342 | E4 | 상태 처리 | 업무 |
| public deadlineList() | L344-347 | 공개 메서드 | 조회창 Sch03_Lookup_IcsUser 열기 | 업무 |
| private viewLaw() | L349-353 | buildGrid | 조회창 Ics01_Lookup_ClassTreeDetail 열기 | 업무 |
| public buildGrid() | L229-245 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L355-357 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L359-361 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L363-365 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L238) addCell
  gb.textCenter('classTreeCd', 100, '분류코드'),  // L239
  gb.text('classTreeFullNm', 780, '분류명'),  // L240
  gb.text('cycleNm', 150, '주기'),  // L241
  gb.boolean('exceptYn', 80, '미사용'),  // L242
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={selectAll}>전체선택</Button>
4. <Button type="removeRow" onClick={releaseAll}>전체해제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

