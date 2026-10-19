# Sch04_Lookup_SchList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch04_Lookup_SchList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch01_Info.selectById` | Sch04_Lookup_SchList:121 | [`Sch01_Info.java:22`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectById`](../../sch/sql/sch01_info.md) |
| `sch.Sch03_Deadline.selectById` | Sch04_Lookup_SchList:83 | [`Sch03_Deadline.java:21`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch04_List.insertCheck` | Sch04_Lookup_SchList:250 | [`Sch04_List.java:207`](../../sch/services/Sch04_List.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.confirmUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.insert`](../../sch/sql/sch04_list.md), [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |
| `sys.Sys10_File.selectByParentId` | Sch04_Lookup_SchList:266 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch06_alarm`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_alarm_info`, `f_get_deadline_nm`, `f_ics_class_tree_nm`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Lookup_SchList (`client/vi/sch/Sch04_Lookup_SchList.java`, 286줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `deaelineFullName` TextField, `note` TextField, `report` TextField, `statusCode` TextField, `className` TextField, `infoId` LongField, `closeDate` MyDateField, `manageDate` MyDateField, `personName` TextField, `statusName` ComboBoxField("ScheduleStatusCode"), `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L137-182) → getEditor(), show()
[E1] statusName[처리여부].Collapse (L150) → 인라인 L150-155 (new CollapseHandler() { @Override pub…)
[E2] updateButton[저장].Select (L156) → update()
[E3] closeButton[닫기].Select (L162) → hide()
[E4] fileButton[첨부파일 확인].Select (L168) → 인라인 L168-174 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L71-77 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L79-94 | view | 서비스 sch.Sch03_Deadline.selectById | 업무 |
| private getEditor() | L184-229 | 생성자 | 상태 처리 | 업무 |
| public update() | L231-263 | E2 | 서비스 sch.Sch04_List.insertCheck | 업무 |
| private setFileButtonText() | L265-276 | settings | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L96-135 | open | 서비스 sch.Sch01_Info.selectById, 이벤트 연결, 초기값: statusName=listModel.getStatusName(("처리여부"), statusCode=listModel.getStatusCode(, title=listModel.getTitle(("일정명"), closeDate=listModel.getCloseDate(, manageDate=listModel.getManageDate(("처리일"), infoId=listModel.getInfoId(, className=listModel.getClassName(("분류"), note=deadlienModel.getNote(("비고"), deaelineFullName=deadlienModel.getDeadlineFullName(("기한"), personName=listModel.getPersonName(("처리자"), content=infoModel.getContent(("상세내용"), report=infoModel.getReport( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L278-280 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L282-284 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L168-174 (new SelectHandler(){ @Override public…) */}>첨부파일 확인</Button>

