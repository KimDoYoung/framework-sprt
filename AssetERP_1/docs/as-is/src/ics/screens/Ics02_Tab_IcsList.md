# Ics02_Tab_IcsList

- 종류: 화면
- 메뉴: 준법감시 > 90. 법규통제 현황(사용X) > 법규통제 운영현황표 (#1016)
- 파일: `client/vi/ics/Ics02_Tab_IcsList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`IcsComboBoxField`](../../ics/components/IcsComboBoxField.md), [`Sch04_Tab_CheckList`](../../sch/screens/Sch04_Tab_CheckList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics02_Manager.selectByIcsList` | Ics02_Tab_IcsList:187 | [`Ics02_Manager.java:38`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.selectByIcsList`](../../ics/sql/ics02_manager.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md)

## DB 함수

`f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_emptrans`, `f_get_ics_manager`, `f_get_std_date`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics02_Tab_IcsList (`client/vi/ics/Ics02_Tab_IcsList.java`, 202줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 대분류기준: {icsName} 담당부서: {orgName} 담당자: {personName} {dailyCheckBox} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `orgName` TextField, `personName` TextField, `dailyCheckBox` CheckBox, `icsName` IcsComboBoxField 빈칸="전체"

#### 이벤트
[E0] 화면 열림 (생성자 L51-100) → setInitData(), retrieve()
[E1] searchButton[조회].Select (L53) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L142-152 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L154-193 | 생성자,E1 | 서비스 ics.Ics02_Manager.selectByIcsList(companyId, personName, orgName, lever1, startDate, closeDate, dailyYn) | 업무 |
| public buildGrid() | L102-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L195-197 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L199-201 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

