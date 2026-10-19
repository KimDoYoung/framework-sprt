# Sch04_Lookup_IcsList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch04_Lookup_IcsList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ics01_Page_IcsFile`](../../ics/components/Ics01_Page_IcsFile.md), [`Ics01_Page_RevisionHistory`](../../ics/components/Ics01_Page_RevisionHistory.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sch04_Lookup_IcsList:191 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr20_RelateIcs.selectById` | Sch04_Lookup_IcsList:119 | [`Apr20_RelateIcs.java:26`](../../apr/services/Apr20_RelateIcs.md) | [`apr20_relate_ics.selectById`](../../apr/sql/apr20_relate_ics.md) |
| `ics.Ics01_ClassTree.selectById` | Sch04_Lookup_IcsList:168 | [`Ics01_ClassTree.java:22`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) |
| `sch.Sch03_Deadline.selectById` | Sch04_Lookup_IcsList:153 | [`Sch03_Deadline.java:21`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Lookup_IcsList (`client/vi/sch/Sch04_Lookup_IcsList.java`, 294줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `deadlineFullName` TextField, `note` TextField, `submitTo` MyTextArea, `apprId` LongField, `infoId` LongField, `apprName` LookupTriggerField, `pageIcsFile` Ics01_Page_IcsFile, `pageRevisionHistory` Ics01_Page_RevisionHistory, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L67-78) → getEditor(), show()
[E1] closeButton[닫기].Select (L133) → hide()
[E2] apprName[원인문서].TriggerClick (L140) → apprView()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L80-97 | 공개 메서드 | 상태 처리 | 업무 |
| private setDeadline() | L152-165 | settings | 서비스 sch.Sch03_Deadline.selectById | 업무 |
| private setIcs() | L167-186 | settings | 서비스 ics.Ics01_ClassTree.selectById | 업무 |
| private setAppr() | L188-202 | settings | 서비스 apr.Apr01_Appr.selectById | 업무 |
| private getEditor() | L204-261 | 생성자 | 상태 처리 | 업무 |
| private apprView() | L263-284 | E2 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private settings() | L99-150 | open | 서비스 apr.Apr20_RelateIcs.selectById, 이벤트 연결, 초기값: infoId=listModel.getInfoId(, apprName="해당 없음"("원인문서") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L286-288 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L290-292 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

