# Dcr01_Tab_DcrUser

- 종류: 화면
- 메뉴: 문서작성 > 01. 문서작성 > 업무별 문서작성 (#1002)
- 파일: `client/vi/dcr/Dcr01_Tab_DcrUser.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Tab_DcrManager`](../../dcr/screens/Dcr01_Tab_DcrManager.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite` | Dcr01_Tab_DcrUser:38 | [`Dcr01_ClassTree.java:190`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByOrgIdRoleWrite_1Bang`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Tab_DcrUser (`client/vi/dcr/Dcr01_Tab_DcrUser.java`, 53줄)


#### 이벤트
[E0] 화면 열림 (생성자 L26-33) → 초기화
[E1] docList[등록].Insert (L30) → insertRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L36-51 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectByOrgIdRoleWrite(companyId, orgId, empId, personId, typeCode) | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>

