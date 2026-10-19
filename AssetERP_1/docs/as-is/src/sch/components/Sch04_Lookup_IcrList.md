# Sch04_Lookup_IcrList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch04_Lookup_IcrList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Icr01_Page_IcrFile`](../../icr/components/Icr01_Page_IcrFile.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sch04_Lookup_IcrList:188 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr22_RelateIcr.selectById` | Sch04_Lookup_IcrList:118 | [`Apr22_RelateIcr.java:26`](../../apr/services/Apr22_RelateIcr.md) | [`apr22_relate_icr.selectById`](../../apr/sql/apr22_relate_icr.md) |
| `icr.Icr01_ClassTree.selectById` | Sch04_Lookup_IcrList:166 | [`Icr01_ClassTree.java:22`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `sch.Sch03_Deadline.selectById` | Sch04_Lookup_IcrList:151 | [`Sch03_Deadline.java:21`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr22_relate_icr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Lookup_IcrList (`client/vi/sch/Sch04_Lookup_IcrList.java`, 287줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `deadlineFullName` TextField, `note` TextField, `submitTo` MyTextArea, `apprId` LongField, `infoId` LongField, `apprName` LookupTriggerField, `pageIcrFile` Icr01_Page_IcrFile, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L65-76) → getEditor(), show()
[E1] closeButton[닫기].Select (L132) → hide()
[E2] apprName[원인문서].TriggerClick (L138) → apprView()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L78-96 | 공개 메서드 | 상태 처리 | 업무 |
| private setDeadline() | L150-163 | settings | 서비스 sch.Sch03_Deadline.selectById | 업무 |
| private setIcr() | L165-183 | settings | 서비스 icr.Icr01_ClassTree.selectById | 업무 |
| private setAppr() | L185-199 | settings | 서비스 apr.Apr01_Appr.selectById | 업무 |
| private getEditor() | L201-254 | 생성자 | 상태 처리 | 업무 |
| private apprView() | L256-277 | E2 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private settings() | L98-148 | open | 서비스 apr.Apr22_RelateIcr.selectById, 이벤트 연결, 초기값: apprName="해당 없음"("원인문서"), infoId=listModel.getInfoId( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L279-281 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L283-285 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

