# 도메인: org

화면 1개, 컴포넌트 7개, 서버 클래스 5개, 매퍼 4개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Org01_Tab_OrgCode`](screens/Org01_Tab_OrgCode.md) | 경영관리 > 01. 조직 및 사원관리 > 조직정보 등록; 기본정보 > 기본정보 > 조직정보 등록 | 5 | 8 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Org00_Lookup_SelectMulti`](components/Org00_Lookup_SelectMulti.md) | adv, ast, bbs, crm, dcr, emp, fnd, ics, mkt, sch, tdm | 1 | 1 |
| [`Org00_Lookup_SelectSingle`](components/Org00_Lookup_SelectSingle.md) | biz, crm, dcr, emp, ics, rpt, sys, tdm | 1 | 3 |
| [`Org00_Lookup_SelectTdm`](components/Org00_Lookup_SelectTdm.md) | tdm | 1 | 1 |
| [`Org01_Tree_OrgCode`](components/Org01_Tree_OrgCode.md) | apr, emp, scm | 1 | 1 |
| [`Org02_Rd_OrgState`](components/Org02_Rd_OrgState.md) | rpt | 1 | 2 |
| [`Org02_View_Chart`](components/Org02_View_Chart.md) | emp | 1 | 0 |
| [`Org10_Lookup_RoleStamp`](components/Org10_Lookup_RoleStamp.md) | apr | 1 | 3 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`org.Org00_OrgInfo`](../org/services/Org00_OrgInfo.md) | 8 |
| [`org.Org01_Code`](../org/services/Org01_Code.md) | 13 |
| [`org.Org02_Info`](../org/services/Org02_Info.md) | 5 |
| [`org.Org02_SearchOrgInfo`](../org/services/Org02_SearchOrgInfo.md) | 1 |
| [`org.Org10_RoleStamp`](../org/services/Org10_RoleStamp.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`org00_org_info`](sql/org00_org_info.md) | 12 |
| [`org01_code`](sql/org01_code.md) | 16 |
| [`org02_info`](sql/org02_info.md) | 8 |
| [`org10_role_stamp`](sql/org10_role_stamp.md) | 5 |

