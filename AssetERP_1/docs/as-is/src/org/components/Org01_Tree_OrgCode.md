# Org01_Tree_OrgCode

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `emp`, `scm`
- 파일: `client/vi/org/Org01_Tree_OrgCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `org.Org01_Code.selectByCompanyId` | Org01_Tree_OrgCode:63 | [`Org01_Code.java:64`](../../org/services/Org01_Code.md) | [`org01_code.selectByParentId_1Bang`](../../org/sql/org01_code.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org01_Tree_OrgCode (`client/vi/org/Org01_Tree_OrgCode.java`, 101줄)


#### 이벤트
[E0] 화면 열림 (생성자 L45-56) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L26-28 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L32-34 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L36-37 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L39-41 | 공개 메서드 | 상태 처리 | 업무 |
| public getTree() | L58-60 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L62-68 | 공개 메서드 | 서비스 org.Org01_Code.selectByCompanyId | 업무 |
| private addChild() | L70-79 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L82-98 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

